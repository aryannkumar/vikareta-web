import { WhatsAppConfig, WhatsAppMessage, Order } from '../types/payment';

export class WhatsAppService {
  private static instance: WhatsAppService;
  private config: WhatsAppConfig;

  private constructor() {
    this.config = {
      apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      webhook_verify_token: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
      enabled: process.env.WHATSAPP_ENABLED === 'true'
    };
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  async sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.enabled) {
      console.log('WhatsApp service is disabled');
      return { success: false, error: 'WhatsApp service is disabled' };
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: message.to,
          type: message.type,
          [message.type]: message.content
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        messageId: result.messages?.[0]?.id
      };
    } catch (error) {
      console.error('WhatsApp message sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send WhatsApp message'
      };
    }
  }

  async sendOrderConfirmation(order: Order): Promise<{ success: boolean; error?: string }> {
    if (!order.user?.phone) {
      return { success: false, error: 'Customer phone number not available' };
    }

    const message: WhatsAppMessage = {
      to: order.user.phone,
      type: 'template',
      content: {
        name: 'order_confirmation',
        language: 'en',
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'text',
                text: order.orderSerialNo
              }
            ]
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: order.user.name
              },
              {
                type: 'text',
                text: order.orderSerialNo
              },
              {
                type: 'currency',
                currency: {
                  fallback_value: `₹${order.total}`,
                  code: 'INR',
                  amount_1000: order.total * 1000
                }
              }
            ]
          }
        ]
      }
    };

    return this.sendMessage(message);
  }

  async sendOrderStatusUpdate(order: Order, status: string): Promise<{ success: boolean; error?: string }> {
    if (!order.user?.phone) {
      return { success: false, error: 'Customer phone number not available' };
    }

    const statusMessage = this.getStatusMessage(status);
    
    const message: WhatsAppMessage = {
      to: order.user.phone,
      type: 'text',
      content: `Hi ${order.user.name},\n\nYour order #${order.orderSerialNo} has been ${statusMessage}.\n\nTrack your order: ${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}\n\nThank you for shopping with Vikareta!`
    };

    return this.sendMessage(message);
  }

  async sendPaymentReminder(order: Order): Promise<{ success: boolean; error?: string }> {
    if (!order.user?.phone) {
      return { success: false, error: 'Customer phone number not available' };
    }

    const message: WhatsAppMessage = {
      to: order.user.phone,
      type: 'text',
      content: `Hi ${order.user.name},\n\nYour order #${order.orderSerialNo} is awaiting payment of ₹${order.total}.\n\nComplete payment: ${process.env.NEXT_PUBLIC_APP_URL}/payment/${order.id}\n\nVikareta Team`
    };

    return this.sendMessage(message);
  }

  async sendRFQNotification(phone: string, rfqId: string, supplierName: string): Promise<{ success: boolean; error?: string }> {
    const message: WhatsAppMessage = {
      to: phone,
      type: 'text',
      content: `🎯 New Quote Received!\n\nSupplier: ${supplierName}\nRFQ ID: #${rfqId}\n\nView details: ${process.env.NEXT_PUBLIC_APP_URL}/rfq/${rfqId}\n\nVikareta B2B Marketplace`
    };

    return this.sendMessage(message);
  }

  async sendBulkMessage(phones: string[], message: string): Promise<{ success: boolean; results: any[]; errors: string[] }> {
    const results = [];
    const errors = [];

    for (const phone of phones) {
      try {
        const result = await this.sendMessage({
          to: phone,
          type: 'text',
          content: message
        });

        results.push({ phone, ...result });
        
        if (!result.success) {
          errors.push(`Failed to send to ${phone}: ${result.error}`);
        }
      } catch (error) {
        const errorMsg = `Error sending to ${phone}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        results.push({ phone, success: false, error: errorMsg });
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      success: errors.length === 0,
      results,
      errors
    };
  }

  private getStatusMessage(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'received and is being processed',
      'confirmed': 'confirmed',
      'processing': 'being prepared',
      'shipped': 'shipped and on the way',
      'delivered': 'successfully delivered',
      'cancelled': 'cancelled',
      'rejected': 'rejected'
    };

    return statusMap[status] || 'updated';
  }

  async verifyWebhook(token: string): Promise<boolean> {
    return token === this.config.webhook_verify_token;
  }

  async handleWebhook(payload: any): Promise<{ success: boolean; message?: string }> {
    try {
      // Handle incoming WhatsApp webhook events
      if (payload.object === 'whatsapp_business_account') {
        for (const entry of payload.entry) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              // Handle incoming messages
              await this.processIncomingMessage(change.value);
            }
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('WhatsApp webhook processing error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Webhook processing failed'
      };
    }
  }

  private async processIncomingMessage(messageData: any): Promise<void> {
    // Process incoming WhatsApp messages (customer queries, order updates, etc.)
    if (messageData.messages) {
      for (const message of messageData.messages) {
        console.log('Incoming WhatsApp message:', message);
        
        // Here you can implement logic to:
        // - Handle customer queries
        // - Process order-related messages
        // - Route messages to appropriate handlers
        // - Store messages in database
        
        // Example: Auto-reply for order status inquiries
        if (message.text?.body?.toLowerCase().includes('order status')) {
          await this.sendMessage({
            to: message.from,
            type: 'text',
            content: 'To check your order status, please visit: ' + process.env.NEXT_PUBLIC_APP_URL + '/account/orders'
          });
        }
      }
    }
  }
}

export const whatsAppService = WhatsAppService.getInstance();