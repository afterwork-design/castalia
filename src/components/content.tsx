import {resource} from "src/server";
import {Box, Stack, VStack, Text, Image} from "@chakra-ui/react";
import ResourcePanel from "./resourcePanel";
import {RounderBox} from "src/components/primitives"

const Content = () => {
    return (
        <VStack
            bgColor="var(--main-bg-color)"
            alignItems="stretch"
            rowGap="30px"
            display="inline-flex"
        >
            {
                resource.map((item) => (<ResourcePanel key={item.name} resource={item} />))
            }
            <VStack
                height="calc(100vh - 30px)"
            >
                <Box flexGrow={1}>
                    <Image src="./bottom.png"></Image>
                </Box>
                <Text color="#999999" fontSize="16px">
                    <span>Designed by </span>
                    <a href="https://tangweijuan.com" target="_blank">Tang Weijuan</a>
                    <span> & Developed by </span>
                    <a href="https://pengfeixc.com" target="_blank">Wang Pengfei</a>
                </Text>
            </VStack>
        </VStack>
    )
};

export default Content;
