import React from "react";
import type {AppProps} from "next/app"
import "polyfill-object.fromentries";
import {DefaultSeo} from "next-seo";
import defaultSeoConfig from "../next-seo.json";
import {ChakraProvider} from "@chakra-ui/react";
import "src/style/index.css";

function MyApp({Component, pageProps}: AppProps) {

    const getLayout = (Component as any).getLayout || ((page: any) => page);
    return (
        <ChakraProvider>
            <DefaultSeo {...defaultSeoConfig} />
            {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
    );
}

export default MyApp
