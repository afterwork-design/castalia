import React, {useRef} from "react";
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
    const linkRef = useRef<HTMLAnchorElement>(null);
    
    const clickHandle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const linkEle = linkRef.current;
        if (linkEle && event.target !== linkEle) {
            linkEle.click();
        };
    };

    return (
        <RounderBox
            display="flex"
            p="15px"
            columnGap="15px"
            _hover={{
                transform: "scale(0.9)",
                bgColor: "#ebedec"
            }}
            transition="all 1s"
            cursor="pointer"
            onClick={clickHandle}
        >
            <Image
                src="/avatar.svg"
                alt={site.name}
                width="80px"
                height="80px"
            />
            <Box>
                <H3 fontSize={16}>
                    <a
                        ref={linkRef}
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {site.name}
                    </a>
                </H3>
                <Text mt="15px" color="gray.400">{site.description}</Text>
            </Box>
        </RounderBox>
    );
};

export default ResourceCard;
