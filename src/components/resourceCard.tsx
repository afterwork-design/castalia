import React from "react";
import {Text, Box} from "@chakra-ui/react";
import {ResourceItem} from "src/server";
import {RounderBox, H3} from "./primitives";
import Image from "next/image";

interface Props {
    site: ResourceItem;
}

const ResourceCard: React.FC<Props> = ({
    site
}) => {
    return (
        <RounderBox
            display="flex"
            p="15px"
            columnGap="15px"
        >
            <Image
                src="/avatar.svg"
                alt={site.name}
                width="80px"
                height="80px"
            />
            <Box>
                <H3>{site.name}</H3>
                <Text mt="15px">{site.description}</Text>
            </Box>
        </RounderBox>
    );
};

export default ResourceCard;
