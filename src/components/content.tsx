import {resource} from "src/server";
import {Box, VStack} from "@chakra-ui/react";
import ContentTop from "./contentTop";
import ResourcePanel from "./resourcePanel";

const Content = () => {
    return (
        <VStack
            p="15px 35px 15px 250px"
            bgColor="var(--main-bg-color)"
            alignItems="stretch"
            rowGap="30px"
        >
            <ContentTop />
            {
                resource.map((item) => (<ResourcePanel key={item.name} resource={item} />))
            }
            <Box height="100vh"></Box>
        </VStack>
    )
};

export default Content;
