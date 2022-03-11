import React from "react";
import {Resource} from "src/server";
import {Box, HStack, Stack} from "@chakra-ui/react";
import Image from "next/image";
import {H2} from "src/components/primitives";

interface Props {
    resource: Resource;
}

const MenuItem: React.FC<Props> = ({
    resource
}) => {

    return (
        <HStack
            alignItems="center"
            p="8px 20px"
            columnGap="10px"
        >
            <Image
                src={resource.icon}
                height={20}
                width={20}
                alt={resource.name}
            />
            <H2
                fontWeight="normal"
                fontSize="1.2rem"
            >
                {resource.name}
            </H2>
        </HStack>
    )
};

export default MenuItem;
