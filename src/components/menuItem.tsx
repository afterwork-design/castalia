import React, {useEffect} from "react";
import {Resource} from "src/server";
import {Box, HStack, Stack} from "@chakra-ui/react";
import Image from "next/image";
import {H2} from "src/components/primitives";
import {useRef} from "react";

interface Props {
    resource: Resource;
    active: boolean;
}

const MenuItem: React.FC<Props> = ({
    resource,
    active
}) => {
    const linkRef = useRef<HTMLAnchorElement>(null);

    const clickHandle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const linkEle = linkRef.current;
        if (linkEle && event.target !== linkEle) {
            linkEle.click();
        }
    };

    return (
        <HStack
            alignItems="center"
            p="8px 20px"
            columnGap="10px"
            onClick={clickHandle}
            bgColor={active ? "#f1eeff" : "white"}
            cursor="pointer"
            _hover={{
                bgColor: "#f1eeff55"
            }}
        >
            <img
                src={resource.icon}
                height={20}
                width={20}
                alt={resource.name}
            />
            <H2
                fontWeight="normal"
                fontSize="14px"
            >
                <a ref={linkRef} href={`#${resource.name}`}>
                    {resource.name}
                </a>
            </H2>
        </HStack>
    );
};

export default MenuItem;
