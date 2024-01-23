import '@/styles/globals.css'
import Head from 'next/head';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <script
          async
          crossorigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5502228624794451"
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;