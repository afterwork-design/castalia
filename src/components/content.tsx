import {resource, ResourceItem} from "src/server";
import {Box, HStack, VStack, Text, Image, useToast} from "@chakra-ui/react";
import ResourcePanel from "./resourcePanel";
import {H2} from "src/components/primitives"
import React, {useEffect, useState} from "react";
import {myCollectionTableName, getDb, isSupportIndexDB} from "src/util/indexDB";
import AddResourceDrawer from "./addResourceDrawer";

export const MyCollectionContext = React.createContext<{
    setMyCollection: React.Dispatch<React.SetStateAction<ResourceItem[]>>
}>({
    setMyCollection: () => { }
});

const Content = () => {
    const [myCollection, setMyCollection] = useState<ResourceItem[]>([]);
    const [addResourceModalOpen, setAddResourceModalOpen] = useState<boolean>(false);
    const toast = useToast();

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

    const importMyCollection = () => {
        var elem = document.createElement("input");
        elem.setAttribute("type", "file");
        elem.addEventListener("change", (event: any) => {
            if (event.target.files.length !== 1) {
                console.log("No file selected");
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const my = JSON.parse(reader.result?.toString() as string);
                    getDb().then((db) => {
                        if (my instanceof Array) {
                            const writePromises: Promise<boolean>[] = [];
                            my.forEach((item) => {
                                writePromises.push(db.write(myCollectionTableName, item));
                            });
                            Promise.allSettled(writePromises).then(() => {
                                toast({
                                    title: "导入完成",
                                    status: "success",
                                    duration: 1000
                                });
                                updateMyCollection();
                            })
                        } else {
                            toast({
                                title: "导入失败, 文件格式错误",
                                status: "error",
                                duration: 2000
                            })
                        }
                    });
                };

                reader.readAsText(event.target.files[0]);
            }
        });

        elem.click();
    };

    const exportMyCollectionToLocal = () => {
        var blob = new Blob([JSON.stringify([myCollection], null, 2)], {type: "application/json;charset=utf-8"}).slice(2, -1);
        var url = URL.createObjectURL(blob);
        var elem = document.createElement("a");
        elem.href = url;
        elem.download = "我的收藏.json";
        elem.click();
    };

    return (
        <MyCollectionContext.Provider value={{setMyCollection}}>
            <VStack
                bgColor="var(--main-bg-color)"
                alignItems="stretch"
                rowGap="30px"
                display="inline-flex"
                pos="relative"
            >
                <HStack
                    pos="absolute"
                    right="10px"
                    top="10px"
                >
                    <Image
                        src="./add.svg"
                        w="22px"
                        cursor="pointer"
                        title="添加至我的"
                        onClick={() => setAddResourceModalOpen(true)}
                    />
                    <Image
                        src="./import.svg"
                        w="22px"
                        cursor="pointer"
                        title="导入"
                        onClick={importMyCollection}
                    />
                    <Image
                        src="./export.svg"
                        w="22px"
                        cursor="pointer"
                        title="导出"
                        onClick={exportMyCollectionToLocal}
                    />
                </HStack>
                <ResourcePanel
                    key={my.name}
                    resource={my}
                    type="MY_COLLECTION"
                    myCollection={myCollection}
                />
                {
                    resource.map((item) => (
                        <ResourcePanel
                            key={item.name}
                            myCollection={myCollection}
                            resource={item}
                            type="NORMAL"
                        />
                    ))
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
                                <b>我的</b>面板中所有内容都是存储在浏览器本地的，所以更换电脑或者浏览器，并不会同步数据。
                                你可以点击卡片右上角的复选框将你喜欢的网站添加至<b>我的</b>。
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
            <AddResourceDrawer open={addResourceModalOpen} close={() => setAddResourceModalOpen(false)} />
        </MyCollectionContext.Provider>
    )
};

export default Content;
