declare global {
  interface Window {
    Cashfree: (config: { mode: 'production' | 'sandbox' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank';
      }) => Promise<{
        error?: {
          message: string;
          code: string;
        };
        redirect?: boolean;
        paymentDetails?: {
          paymentMessage: string;
          paymentStatus: string;
          transactionId: string;
        };
      }>;
    };
  }
}

export {};