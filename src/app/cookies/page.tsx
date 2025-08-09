import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Vikareta',
  description: 'Cookie policy for Vikareta B2B Marketplace',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your computer or mobile device 
              when you visit our website. They help us provide you with a better experience 
              by remembering your preferences and improving our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold mb-2">Session Cookies</h3>
              <p className="text-gray-600">
                These are temporary cookies that are deleted when you close your browser. 
                They help us maintain your session while you navigate our site.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold mb-2">Persistent Cookies</h3>
              <p className="text-gray-600">
                These cookies remain on your device for a set period or until you delete them. 
                They help us remember your preferences for future visits.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies in various ways. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>View what cookies are stored on your device</li>
              <li>Delete cookies individually or all at once</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies from being set</li>
            </ul>
            <p className="mb-4">
              Please note that disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Cookie Policy, please contact us at{' '}
              <a href="mailto:privacy@vikareta.com" className="text-blue-600 hover:underline">
                privacy@vikareta.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}