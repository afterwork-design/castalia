// @ts-nocheck
import {resource, ResourceItem} from "src/server";
import {Box, Text, Image, useToast, Link} from "@chakra-ui/react";
import ResourcePanel from "./resourcePanel";
import {RounderBox, H2} from "src/components/primitives"
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
            <Box
                bgColor="var(--main-bg-color)"
                display="inline-flex"
                flexDirection="column"
                gap="30px"
                pos="relative"
            >
                <Box
                    pos="absolute"
                    right="10px"
                    top="10px"
                    display="flex"
                    gap="8px"
                >
                    <button
                        className="action-btn"
                        onClick={() => setAddResourceModalOpen(true)}
                        type="button"
                    >
                        添加
                    </button>
                    <button
                        className="action-btn"
                        onClick={importMyCollection}
                        type="button"
                    >
                        导入
                    </button>
                    <button
                        className="action-btn"
                        onClick={exportMyCollectionToLocal}
                        type="button"
                    >
                        导出
                    </button>
                </Box>
                <ResourcePanel
                    key={my.name}
                    resource={my}
                    hasCollectBtn={false}
                    hasDeleteBtn
                    myCollection={myCollection}
                />
                {
                    resource.map((item) => (<ResourcePanel key={item.name} myCollection={myCollection} resource={item} hasDeleteBtn={false} hasCollectBtn />))
                }
                <Box
                    height="calc(100vh - 250px)"
                    id="关于"
                    display="flex"
                    flexDirection="column"
                >
                    <Box flexGrow={1} alignSelf="stretch" pt="100px">
                        <H2 fontSize="16px" mb="15px">关于</H2>
                        <Box display="flex" flexDirection="column" alignItems="flex-start" fontSize="16px" gap="12px">
                            <Text>
                                Castaila 是一个资源导航网站，精选国内外优质网站，
                                让每个人都能找到自己需要的资源。如果你有比较好的资源，可以通过下方地址提供给我们。
                            </Text>
                            <Text>
                                Castalia 是 Afterwork 中的一个项目，想了解更多其他项目可以点击下方图片。
                            </Text>
                            <Link href="https://afterwork-design.github.io">
                                <Image src="./afterwork.svg" alt="Afterwork 项目" m="15px 0" />
                            </Link>
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
                        </Box>
                    </Box>
                    <Text color="#999999" fontSize="16px">
                        <span>Designed by </span>
                        <a href="https://tangweijuan.com" target="_blank" rel="noreferrer">Tang Weijuan</a>
                        <span> & Developed by </span>
                        <a href="https://pengfeixc.com" target="_blank" rel="noreferrer">Wang Pengfei</a>
                    </Text>
                </Box>
            </Box>
            <AddResourceDrawer open={addResourceModalOpen} close={() => setAddResourceModalOpen(false)} />
            <style jsx>{`
                .action-btn {
                    padding: 0 10px;
                    height: 28px;
                    border: 1px solid #d9d9d9;
                    border-radius: 6px;
                    font-size: 14px;
                    line-height: 1;
                    background: #fff;
                    color: #34314c;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .action-btn:hover {
                    background: #f3f4f6;
                    border-color: #bfc3cf;
                }
            `}</style>
        </MyCollectionContext.Provider>
    )
};

export default Content;
