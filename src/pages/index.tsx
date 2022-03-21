import {LayoutPage} from "../typing";
import {Box, Flex, HStack} from "@chakra-ui/react";
import Sider from "src/components/sider";
import Content from "src/components/content";
import ContentTop from "src/components/contentTop";

const Home: LayoutPage = () => {
    return (
        <Box>
            <ContentTop description="不只是设计师的灵感源泉" />
            <HStack
                alignItems="start"
                columnGap="15px"
                pt="20px"
            >
                <Sider />
                <Content />
            </HStack>
        </Box>
    );
};

export default Home;
