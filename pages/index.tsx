import { NextPage } from 'next';
import Head from 'next/head';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vikareta - B2B Marketplace</title>
        <meta name="description" content="Connect, Trade, and Grow with Vikareta" />
      </Head>

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome to Vikareta</h1>
        <p>Your trusted B2B marketplace</p>
        <div style={{ marginTop: '2rem' }}>
          <button style={{ margin: '0.5rem', padding: '1rem 2rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
            Start Buying
          </button>
          <button style={{ margin: '0.5rem', padding: '1rem 2rem', backgroundColor: 'white', color: '#0070f3', border: '2px solid #0070f3', borderRadius: '5px' }}>
            Start Selling
          </button>
        </div>
      </main>
    </>
  );
};

export default HomePage;
