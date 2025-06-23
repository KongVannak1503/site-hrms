import React, { useState } from 'react';
import api from '../../services/api';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload Success:', res.data);
            alert('Upload successful');
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed');
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleChange} />
            {preview && (
                <div style={{ marginTop: '10px' }}>
                    <strong>Preview:</strong>
                    <div><img src={preview} alt="preview" style={{ width: 100, height: 'auto' }} /></div>
                </div>
            )}
            <br />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadForm;
