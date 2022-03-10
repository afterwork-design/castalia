import React from "react";
import {Text, Box} from "@chakra-ui/react";
import {H1, RounderBox} from "src/components/primitives";
import {resource} from "src/server/";
import MenuItem from "./menuItem";

interface Props {
    siteName: string;
    description: string;
}

const Sider: React.FC<Props> = ({
    siteName,
    description
}) => {

    return (
        <RounderBox
            position="fixed"
            top="15px"
            bottom="15px"
            left="15px"
            backgroundColor="white"
            width="200px"
            textAlign="center"
            paddingTop="50px"
        >
            <H1 color="#644be4" mb="5px">{siteName}</H1>
            <Text fontSize="10px" color="#c1c1c1">{description}</Text>
            <Box mt="30px">
                {
                    resource.map((item) => (<MenuItem resource={item} key={item.name} />))
                }
            </Box>
        </RounderBox>
    );
};

export default Sider;
