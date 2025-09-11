import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vikareta.com'),
  title: 'Google OAuth Data Use - Vikareta',
  description: 'How Vikareta uses Google user data obtained via OAuth',
};

export default function GoogleOAuthDataUsePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1>Google OAuth Data Use</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>What data we request</h2>
        <p>
          When you choose “Sign in with Google”, Vikareta requests your basic Google profile information
          (name, email, and profile picture) via the standard OAuth scopes
          <code>openid</code>, <code>email</code>, and <code>profile</code>.
        </p>

        <h2>How we use this data</h2>
        <ul>
          <li>To create or sign you in to your Vikareta account.</li>
          <li>To prefill your profile with your name and profile image.</li>
          <li>To send essential account communications to your verified email.</li>
        </ul>

        <h2>Data sharing</h2>
        <p>
          We do not sell or share your Google user data with third parties. Data may be processed by
          our service providers only to operate our platform, in accordance with our{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>Retention and deletion</h2>
        <p>
          You can request deletion of your account and associated personal data at any time by
          contacting <a href="mailto:privacy@vikareta.com">privacy@vikareta.com</a>. Upon verification,
          we will delete your account and associated personal data, subject to legal or regulatory
          retention requirements.
        </p>

        <h2>Limited Use compliance</h2>
        <p>
          If at any time Vikareta accesses Google user data subject to Google’s Limited Use Requirements,
          we will adhere to those policies, using data only to provide or improve user-facing features,
          not transferring data to third parties except as necessary to provide those features, and not
          using data for serving ads.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about Google OAuth data use, contact us at{' '}
          <a href="mailto:privacy@vikareta.com">privacy@vikareta.com</a>.
        </p>
      </div>
    </div>
  );
}
