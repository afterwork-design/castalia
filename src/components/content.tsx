import {resource, ResourceItem} from "src/server";
import {Box, Stack, VStack, Text, Image} from "@chakra-ui/react";
import ResourcePanel from "./resourcePanel";
import {RounderBox, H2} from "src/components/primitives"
import React, {useEffect, useState} from "react";
import {myCollectionTableName, getDb, isSupportIndexDB} from "src/util/indexDB";

export const MyCollectionContext = React.createContext<{
    setMyCollection: React.Dispatch<React.SetStateAction<ResourceItem[]>>
}>({
    setMyCollection: () => { }
});

const Content = () => {
    const [myCollection, setMyCollection] = useState<ResourceItem[]>([]);

    const updateMyCollection = () => {
        if (isSupportIndexDB()) {
            getDb().then((db) => {
                db.readAll(myCollectionTableName).then((res => {
                    if (res) {
                        setMyCollection(res as ResourceItem[]);
                    }
                }));
            });
        }
    };

    useEffect(() => {
        updateMyCollection();
    }, []);

    const my = {
        name: "我的",
        site: myCollection,
        icon: ""
    };

    return (
        <MyCollectionContext.Provider value={{setMyCollection}}>
            <VStack
                bgColor="var(--main-bg-color)"
                alignItems="stretch"
                rowGap="30px"
                display="inline-flex"
            >
                <ResourcePanel
                    key={my.name}
                    resource={my}
                    hasCollectBtn={false}
                />
                {
                    resource.map((item) => (<ResourcePanel key={item.name} resource={item} hasCollectBtn={true} />))
                }
                <VStack
                    height="calc(100vh - 250px)"
                >
                    <Box flexGrow={1} alignSelf="stretch" pt="100px">
                        <H2 fontSize="16px" mb="15px">关于</H2>
                        <VStack alignItems="flex-start" fontSize="16px">
                            <Text>
                                Castaila 是一个资源导航网站，不只是设计师的灵感源泉，精选国内外优质网站，
                                让每个人都能找到自己需要的资源。如果你有比较好的资源，可以通过下方地址提供给我们。
                            </Text>
                            <Text>
                                项目地址：
                                <a className="linkColor" href="https://github.com/afterwork-design/castalia">castalia | github</a>
                            </Text>
                            <Text>
                                资源推荐入口：
                                <a className="linkColor" href="https://github.com/afterwork-design/castalia/issues?q=label%3A%E8%B5%84%E6%BA%90%E6%8E%A8%E8%8D%90+">github 上提交 issue</a>
                            </Text>
                        </VStack>
                    </Box>
                    <Text color="#999999" fontSize="16px">
                        <span>Designed by </span>
                        <a href="https://tangweijuan.com" target="_blank">Tang Weijuan</a>
                        <span> & Developed by </span>
                        <a href="https://pengfeixc.com" target="_blank">Wang Pengfei</a>
                    </Text>
                </VStack>
            </VStack>
        </MyCollectionContext.Provider>
    )
};

export default Content;
