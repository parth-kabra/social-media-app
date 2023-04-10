import Head from "next/head";

export default function StaticHead(){
    return (
        <Head>
        <title>Friendverse</title>
        <meta name="description" content="Welcome to the world where everyone is a friend!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    )
}