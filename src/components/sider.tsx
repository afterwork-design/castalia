import React, {useEffect, useState} from "react";
import {Box} from "@chakra-ui/react";
import {RounderBox} from "src/components/primitives";
import {resource, Resource} from "src/server/";
import MenuItem from "./menuItem";


const siderResource: Resource[] = [
    {
        name: "我的",
        site: [],
        icon: "./images/menu/mine.svg"
    },
    ...resource
];

const aboutItem: Resource = {
    name: "关于",
    site: [],
    icon: ""
};

const Sider = () => {
    const [activeResource, setActiveResource] = useState<Resource>(siderResource[0]);

    useEffect(() => {
        const handle = () => {
            let closest: Resource | null = null;
            let closestDistance = Infinity;

            for (let i = 0; i < siderResource.length; i++) {
                const target = document.querySelector(`#${siderResource[i].name}`);
                if (target) {
                    const rect = target.getBoundingClientRect();
                    // 找到距离视口顶部最近的元素（在顶部以上）
                    if (rect.top <= 100) {
                        const distance = Math.abs(rect.top - 100);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closest = siderResource[i];
                        }
                    }
                }
            }

            if (closest) {
                setActiveResource(closest);
            }
        };

        window.addEventListener("scroll", handle);
        // 初始执行一次
        handle();

        return () => {
            window.removeEventListener("scroll", handle);
        }
    }, []);

    return (
        <RounderBox
            position="sticky"
            top="15px"
            backgroundColor="white"
            width="200px"
            textAlign="center"
            paddingTop="50px"
            flexShrink={0}
            display={["none", "flex", "flex", "flex", "flex"]}
            height="calc(100vh - 210px)"
            flexDirection="column"
        >
            <Box flex="1" overflowY="auto">
                {
                    siderResource.map((item) => (
                        <MenuItem
                            resource={item}
                            key={item.name}
                            active={activeResource.name === item.name}
                        />
                    ))
                }
            </Box>
            <Box borderTop="1px solid #f0f0f0" pt="10px">
                <MenuItem
                    resource={aboutItem}
                    key={aboutItem.name}
                    active={activeResource.name === aboutItem.name}
                    hideIcon={true}
                />
            </Box>
        </RounderBox>
    );
};

export default Sider;
