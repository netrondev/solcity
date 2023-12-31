import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />

        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="overflow-x-hidden overflow-y-scroll">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
