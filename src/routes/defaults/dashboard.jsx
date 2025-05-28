import { Breadcrumb, Button, Flex } from "antd";
import { useContext, useEffect, useState } from "react";
import ModalLgCenter from "../../components/modals/ModalLgCenter";
import { LanguageContext } from "../../components/Translate/LanguageContext";
import TableSample from "./TableSample";
import { Content } from "antd/es/layout/layout";
import { Styles } from "../../components/utils/CsStyle";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [responsiveOpen, setResponsiveOpen] = useState(false);
    const { content } = useContext(LanguageContext)
    const { theme, setTheme } = useContext(LanguageContext)


    useEffect(() => {
        document.title = content['dashboard'];
    }, [content]);

    return (
        <>
            <Breadcrumb
                className="text-gray-700 dark:text-gray-400"
                separator={<span className="text-gray-700 dark:text-gray-400">/</span>}
                itemRender={(route, params, routes, paths) => (
                    <span className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white/90">
                        {route.breadcrumbName}
                    </span>
                )}
                items={[
                    { breadcrumbName: 'Home' },
                    { breadcrumbName: 'Application Center' },
                    { breadcrumbName: 'Application List' },
                    { breadcrumbName: 'App' },
                ]}
            />

            <Content
                className=" border border-gray-200 bg-white p-5 dark:border-gray-800 dark:!bg-white/[0.03] md:p-6"
                style={{
                    padding: 24,
                    minHeight: 800,
                    // backgroundColor: theme == "light" ? Styles.lightMode : Styles.darkMode,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >

                <Button type="primary" onClick={() => setOpen(true)}>
                    Open Modal
                </Button>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo atque temporibus dolorum sit cum non dolor a, provident facilis, aut reprehenderit sunt quo accusamus inventore voluptate maiores alias laboriosam fuga.
                </p>

                <ModalLgCenter
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    title="My Custom Modal"
                >
                    <TableSample /> {/* Nested component */}
                    <p>This is the content inside the modal!</p>
                </ModalLgCenter>
            </Content>
        </>
    );
};
export default Dashboard
