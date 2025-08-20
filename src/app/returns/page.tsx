import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds - Vikareta',
  description: 'Return and refund policy for Vikareta marketplace',
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Returns & Refunds</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <p className="mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy 
              with your order, you may be eligible for a return within 7 days of delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Eligible Items</h2>
            <p className="mb-4">Items eligible for return must be:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>In original condition and packaging</li>
              <li>Unused and undamaged</li>
              <li>Returned within 7 days of delivery</li>
              <li>Accompanied by original invoice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
            <p className="mb-4">The following items cannot be returned:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Customized or personalized products</li>
              <li>Perishable goods</li>
              <li>Items damaged by misuse</li>
              <li>Products without original packaging</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li>Contact the seller within 7 days of delivery</li>
              <li>Provide order number and reason for return</li>
              <li>Wait for return authorization</li>
              <li>Package item securely with original packaging</li>
              <li>Ship using provided return label</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
            <p className="mb-4">
              Once we receive and inspect your returned item, we will process your refund. 
              Refunds will be credited to your original payment method within 5-7 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="mb-4">
              For questions about returns or refunds, contact our support team at{' '}
              <a href="mailto:returns@vikareta.com" className="text-blue-600 hover:underline">
                returns@vikareta.com
              </a>{' '}
              or call +91-9934109996.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}