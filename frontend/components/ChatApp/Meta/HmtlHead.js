import React from 'react';
import Head from 'next/head';

export default function HtmlHead(){
   return (
    <Head>
    <    meta charSet="utf-8" />
        <title>Chat | Driverbase</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta content="Chat With Users On Driverbase" name="description" />
        <meta content name="Driverbase" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* App favicon */}
        <link rel="shortcut icon" href="/DriverBaseTransparentBackground.png" />
        <link rel="manifest" href="/manifest.json"/>

        {/* magnific-popup css */}
        {/* owl.carousel css */}
        <link rel="stylesheet" href="/chatapp-assets/assets/css/tailwind2.css" />
    </Head>
   )
}
