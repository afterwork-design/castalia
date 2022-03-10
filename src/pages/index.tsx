import {LayoutPage} from "../typing";
import {useEffect, useState} from "react";
import {Box} from "@chakra-ui/react";
import Sider from "src/components/sider";
import {GetStaticProps} from "next";

const Home: LayoutPage = () => {
    return (
        <Box>
            <Sider
                siteName="Castalia"
                description="不只是设计师的灵感源泉"
            />
        </Box>
    );
};

export default Home;
