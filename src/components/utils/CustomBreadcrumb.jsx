import React from 'react';
import { Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';

const CustomBreadcrumb = ({ items }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumb
            separator={<span className="text-gray-700 dark:text-gray-400">/</span>}
            itemRender={(route) => {
                const isClickable = !!route.path;

                return (
                    <span
                        className={`${isClickable
                                ? 'text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white/90 cursor-pointer'
                                : 'text-gray-500 dark:text-gray-600'
                            }`}
                        onClick={() => {
                            if (isClickable) navigate(route.path);
                        }}
                    >
                        {route.breadcrumbName}
                    </span>
                );
            }}
            items={items}
        />
    );
};

export default CustomBreadcrumb;
