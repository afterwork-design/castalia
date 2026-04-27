/* eslint-disable @next/next/no-img-element */
import React, {useState, useRef, useEffect, useContext, useLayoutEffect} from "react";
import {Box} from "@chakra-ui/react";
import {ResourceItem} from "src/server";
import {RounderBox, H3} from "./primitives";
import {getDb, myCollectionTableName} from "src/util/indexDB";
import {MyCollectionContext} from "src/components/content";

interface Props {
    site: ResourceItem;
    hasCollectBtn: boolean;
    hasDeleteBtn: boolean;
    checked?: boolean;
}

const ResourceCard: React.FC<Props> = ({
    site,
    hasCollectBtn,
    hasDeleteBtn,
    checked
}) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const {setMyCollection} = useContext(MyCollectionContext);
    const [isHovered, setIsHovered] = useState(false);
    const isCollected = Boolean(checked);
    const collectIconSrc = isCollected ? "./heart.svg" : "./heart-plus.svg";
    const collectAltText = isCollected ? "已收藏" : "收藏";
    const descriptionText = site.description ?? "";

    const clickHandle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const linkEle = linkRef.current;
        if (linkEle && event.target !== linkEle) {
            linkEle.click();
        };
    };

    const checkBoxChange = () => {
        getDb().then((db) => {
            if (!checked) {
                db.write(myCollectionTableName, site).then((res) => {
                    if (res) {
                        console.log("添加成功");
                        setMyCollection((collection) => ([...collection, site]));
                    } else {
                        console.log("添加失败");
                    }
                });
            } else {
                db.remove(myCollectionTableName, site.name).then((res) => {
                    if (res) {
                        console.log("删除成功");
                        setMyCollection((collection) => {
                            const index = collection.findIndex((item) => item.name === site.name);
                            if (index !== -1) {
                                const newCollection = [...collection];
                                newCollection.splice(index, 1);
                                return newCollection;
                            }
                            return collection;
                        });
                    } else {
                        console.log("删除失败");
                    }
                })
            }
        });
    };

    const deleteFromMyCollection = () => {
        getDb().then((db) => {
            db.remove(myCollectionTableName, site.name).then((res) => {
                if (res) {
                    console.log("删除成功");
                    // setChecked(false);
                    setMyCollection((collection) => {
                        const index = collection.findIndex((item) => item.name === site.name);
                        if (index !== -1) {
                            const newCollection = [...collection];
                            newCollection.splice(index, 1);
                            return newCollection;
                        }
                        return collection;
                    });
                } else {
                    console.log("删除失败");
                }
            })
        })
    };

    return (
        <RounderBox
            display="flex"
            p="15px"
            columnGap="15px"
            _hover={{
                boxShadow: "rgb(0 36 100 / 20%) 0px 26px 20px -24px"
            }}
            transition="all 1s"
            cursor="pointer"
            onClick={clickHandle}
            pos="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {
                site.image ? (
                    <Box flexShrink={0} w="32px">
                        <img
                            src={site.image}
                            alt={site.name}
                            width={32}
                            height={32}
                            loading="lazy"
                        />
                    </Box>
                ) : null
            }
            <Box>
                <H3 fontSize="16px">
                    <a
                        ref={linkRef}
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {site.name}
                    </a>
                </H3>
                <p style={{marginTop: "14px", fontSize: "13px", color: "#718096"}}>{descriptionText}</p>
            </Box>
            {
                hasCollectBtn ? (
                    <Box
                        pos="absolute"
                        right="10px"
                        top="10px"
                        opacity={isHovered ? 1 : 0}
                        transition="opacity 0.2s"
                    >
                        <Box
                            w="28px"
                            h="28px"
                            borderRadius="999px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            transition="background-color 0.2s"
                            _hover={{
                                backgroundColor: "gray.100"
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                                checkBoxChange();
                            }}
                        >
                            <img
                                src={collectIconSrc}
                                width={20}
                                height={20}
                                alt={collectAltText}
                            />
                        </Box>
                    </Box>
                ) : null
            }
            {
                hasDeleteBtn ? (
                    <Box
                        pos="absolute"
                        right="10px"
                        top="10px"
                        opacity={isHovered ? 1 : 0}
                        transition="opacity 0.2s"
                    >
                        <Box
                            w="28px"
                            h="28px"
                            borderRadius="999px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            transition="background-color 0.2s"
                            _hover={{
                                backgroundColor: "gray.100"
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteFromMyCollection();
                            }}
                            title="删除"
                        >
                            <img
                                src="./delete.svg"
                                width={20}
                                height={20}
                                alt="删除"
                            />
                        </Box>
                    </Box>
                ) : null
            }
        </RounderBox>
    );
};

export default ResourceCard;
