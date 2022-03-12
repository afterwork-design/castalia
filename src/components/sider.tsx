import React, {useEffect, useState} from "react";
import {Text, Box} from "@chakra-ui/react";
import {H1, RounderBox} from "src/components/primitives";
import {resource, Resource} from "src/server/";
import MenuItem from "./menuItem";

interface Props {
    siteName: string;
    description: string;
}

const Sider: React.FC<Props> = ({
    siteName,
    description
}) => {
    const [activeResource, setActiveResource] = useState<Resource>(resource[0]);

    useEffect(() => {
        const handle = () => {
            for (let i = 0; i < resource.length; i++) {
                const target = document.querySelector(`#${resource[i].name}`);
                if (target && target.getBoundingClientRect().top >= 0) {
                    setActiveResource(resource[i]);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handle);

        return () => {
            window.removeEventListener("scroll", handle);
        }
    }, []);

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
            {/* <H1 color="#644be4" mb="5px">{siteName}</H1> */}
            <img
                src="./castalia.png"
                width="170"
                style={{
                    display: "inline"
                }}
            >
            </img>
            <Text fontSize="14px" color="#999999">{description}</Text>
            <Box mt="30px">
                {
                    resource.map((item) => (
                        <MenuItem
                            resource={item}
                            key={item.name}
                            active={activeResource.name === item.name}
                        />
                    ))
                }
            </Box>
        </RounderBox>
    );
};

export default Sider;
