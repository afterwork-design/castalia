import React from "react";
import type {AppProps} from "next/app"
import "polyfill-object.fromentries";
import {DefaultSeo} from "next-seo";
import defaultSeoConfig from "../next-seo.json";

function MyApp({Component, pageProps}: AppProps) {

    const getLayout = (Component as any).getLayout || ((page: any) => page);
    return (
        <>
            <DefaultSeo {...defaultSeoConfig} />
            {getLayout(<Component {...pageProps} />)}
        </>
    );
}

export default MyApp
