import {FC, useContext} from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Textarea,
    Button,
    useToast
} from "@chakra-ui/react";
import {Field, Form, Formik} from 'formik';
import {getDb, myCollectionTableName} from "src/util/indexDB";
import {MyCollectionContext} from "src/components/content";
import {ResourceItem} from "src/server";

interface Props {
    open: boolean;
    close: () => void;
}

const AddResourceDrawer: FC<Props> = ({
    open,
    close
}) => {
    const {setMyCollection} = useContext(MyCollectionContext);
    const toast = useToast();
    return (
        <Drawer
            isOpen={open}
            onClose={close}
            closeOnOverlayClick={false}
        >
            <DrawerOverlay />
            <DrawerContent>
                <Formik
                    initialValues={{name: '', url: '', description: ""}}
                    onSubmit={(values: ResourceItem) => {
                        getDb().then((db) => {
                            db.write(myCollectionTableName, values).then((res) => {
                                if (res) {
                                    toast({
                                        title: "添加资源成功",
                                        status: "success",
                                        duration: 1000
                                    })
                                    setMyCollection((collection) => ([...collection, values]));
                                    close();
                                } else {
                                    toast({
                                        title: "添加资源失败，可能是资源名称与已有资源名重复了。",
                                        status: "error",
                                        duration: 2000
                                    })
                                }
                            });
                        });
                    }}
                >
                    {
                        (props) => (
                            <Form style={{height: "100%"}}>
                                <DrawerHeader>添加至我的</DrawerHeader>
                                <DrawerBody>
                                    <Field name="name">
                                        {
                                            ({field, form}: any) => (
                                                <FormControl
                                                    isRequired
                                                    isInvalid={form.errors.name && form.touched.name}
                                                >
                                                    <FormLabel htmlFor="name">资源名称</FormLabel>
                                                    <Input {...field} id="name" placeholder="不允许与已有资源名称重复" />
                                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                                </FormControl>
                                            )
                                        }
                                    </Field>
                                    <Field name="url">
                                        {
                                            ({field, form}: any) => (
                                                <FormControl
                                                    isRequired
                                                    isInvalid={form.errors.url && form.touched.url}
                                                    mt="10px"
                                                >
                                                    <FormLabel htmlFor="url">资源地址</FormLabel>
                                                    <Input {...field} id="url" placeholder="合法的 url，以 http/https 开头" type="url" />
                                                    <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                                                </FormControl>
                                            )
                                        }
                                    </Field>
                                    <Field name="description">
                                        {
                                            ({field, form}: any) => (
                                                <FormControl
                                                    isInvalid={form.errors.description && form.touched.description}
                                                    mt="10px"
                                                >
                                                    <FormLabel htmlFor="url">资源描述</FormLabel>
                                                    <Textarea
                                                        {...field}
                                                        minH="200px"
                                                        id="url"
                                                        placeholder="资源描述"
                                                    />
                                                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                                                </FormControl>
                                            )
                                        }
                                    </Field>
                                </DrawerBody>
                                <DrawerFooter>
                                    <Button onClick={close} mr="10px">取消</Button>
                                    <Button isLoading={props.isSubmitting} type="submit">确认</Button>
                                </DrawerFooter>
                            </Form>
                        )
                    }
                </Formik>
            </DrawerContent>
        </Drawer>
    )
};

export default AddResourceDrawer;
