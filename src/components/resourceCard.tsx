/* eslint-disable @next/next/no-img-element */
import React, {useRef, useContext, PropsWithChildren} from "react";
import {Checkbox, Text, Box, Image, BoxProps} from "@chakra-ui/react";
import {ResourceItem} from "src/server";
import {RounderBox, H3} from "./primitives";
import {getDb, myCollectionTableName} from "src/util/indexDB";
import {MyCollectionContext} from "src/components/content";

export interface Data extends ResourceItem {
    sort: number;
}

interface Props {
    site: ResourceItem;
}

const ResourceCard: React.FC<PropsWithChildren<Props & BoxProps>> = ({
    site,
    children,
    ...props
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
                boxShadow: "rgb(0 36 100 / 20%) 0px 26px 20px -24px"
            }}
            transition="all 1s"
            cursor="pointer"
            onClick={clickHandle}
            pos="relative"
            pr="60px"
            {...props}
        >
            {
                site.image ? (
                    <Box flexShrink={0} w="60px">
                        <img
                            src={site.image}
                            alt={site.name}
                            width={50}
                            height={50}
                        />
                    </Box>
                ) : <></>
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
                <Text mt="14px" fontSize="14px" color="gray.400">{site.description}</Text>
            </Box>
            {children}
        </RounderBox>
    );
};

export const NormalCard: React.FC<{site: ResourceItem; checked: boolean}> = ({
    site,
    checked
}) => {
    const {updateMyCollection, myCollection} = useContext(MyCollectionContext);

    const checkBoxChange = () => {
        getDb().then((db) => {
            if (!checked) {
                db.write(myCollectionTableName, {sort: myCollection.length, ...site}).then((res) => {
                    if (res) {
                        console.log("添加成功");
                        updateMyCollection();
                    } else {
                        console.log("添加失败");
                    }
                });
            } else {
                db.remove(myCollectionTableName, site.name).then(async (res) => {
                    if (res) {
                        console.log("删除成功");
                        const dataSite = myCollection.find((item) => item.name === site.name);
                        if(dataSite) {
                            for (let i = dataSite.sort + 1; i < myCollection.length; i++) {
                                await db.update(myCollectionTableName, {...myCollection[i], sort: i - 1});
                            }
                        }
                        updateMyCollection();
                    } else {
                        console.log("删除失败");
                    }
                })
            }
        });
    };

    return (
        <ResourceCard site={site}>
            <Box
                pos="absolute"
                right="10px"
                top="10px"
                onClick={(event) => event.stopPropagation()}
            >
                <Checkbox
                    cursor="default"
                    isChecked={checked}
                    onChange={checkBoxChange}
                />
            </Box>
        </ResourceCard>
    );
};

export const MyCollectionCard: React.FC<{site: Data;}> = ({
    site
}) => {
    const {updateMyCollection, myCollection} = useContext(MyCollectionContext);

    const deleteFromMyCollection = () => {
        getDb().then((db) => {
            db.remove(myCollectionTableName, site.name).then(async (res) => {
                if (res) {
                    console.log("删除成功");
                    for (let i = site.sort + 1; i < myCollection.length; i++) {
                        await db.update(myCollectionTableName, {...myCollection[i], sort: i - 1});
                    }
                    updateMyCollection();
                } else {
                    console.log("删除失败");
                }
            })
        })
    };
    return (
        <ResourceCard
            site={site}
            minH="100px"
        >
            <Image
                src="./delete.svg"
                height="24px"
                pos="absolute"
                right="10px"
                top="10px"
                onClick={(event) => {
                    event.stopPropagation();
                    deleteFromMyCollection();
                }}
                title="删除"
                cursor="default"
            />
            <Image
                src="./drag.svg"
                height="20px"
                pos="absolute"
                right="12px"
                bottom="10px"
                onClick={(event) => {
                    event.stopPropagation();
                }}
                cursor="grab"
            />
        </ResourceCard>
    );
};
