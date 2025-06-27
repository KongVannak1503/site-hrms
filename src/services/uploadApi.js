import { message } from "antd";
import api from "./api";


const uploadUrl = 'http://localhost:3000/api';

export const handleDownload = async (filePath, fileName) => {
    try {
        const response = await api.get(`/${filePath}`, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'downloaded_file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        message.error('Failed to download file');
    }
};



export default uploadUrl;