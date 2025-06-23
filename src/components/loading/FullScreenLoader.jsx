// components/FullScreenLoader.jsx
import React from "react";
import { Spin } from "antd";

const FullScreenLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen"><Spin size="large" /></div>
    );
};

export default FullScreenLoader;
