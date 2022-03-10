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
        >
            <Image src="/avatar.svg"
                height={30}
                width={30}
                alt={resource.name}
            />
            <H2 fontWeight="normal" fontSize="1rem">{resource.name}</H2>
        </HStack>
    )
};

export default MenuItem;
