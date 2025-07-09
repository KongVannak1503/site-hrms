import { message } from "antd";
import api from "./api";


const uploadUrl = 'http://localhost:3000/api';

/**
 * Download file from server
 * @param {string} filePath - the relative path (e.g., 'download/filename.pdf')
 * @param {string} fileName - optional custom download name
 */
export const downloadFile = async (filePath, fileName) => {
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


export const handleDownload = async (filePath, fileName) => {
    try {
        const response = await api.get(`/${filePath}`, {
            responseType: 'blob', // always get blob to support any file
        });

        // Use the content-type header if you want, otherwise blob works for all files
        const contentType = response.headers['content-type'] || 'application/octet-stream';

        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        // Make sure fileName includes an extension if possible
        let downloadFileName = fileName || 'downloaded_file';

        // If filename does not have extension but content-type is known, try adding extension
        if (!/\.[0-9a-z]+$/i.test(downloadFileName)) {
            const extension = contentType.split('/')[1];
            if (extension) downloadFileName += `.${extension}`;
        }

        const link = document.createElement('a');
        link.href = url;
        link.download = downloadFileName;
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