import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaPlay, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const BunnyStreamUploader = ({ onVideoUploaded, currentVideoUrl = '', lessonTitle = '' }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [uploadMessage, setUploadMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState(currentVideoUrl);
    const fileInputRef = useRef(null);

    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            toast.error('نوع الملف غير مدعوم. يُرجى اختيار MP4, MPEG, MOV, AVI, أو WebM');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            toast.error('حجم الملف كبير جداً. الحد الأقصى هو 2 جيجابايت');
            return;
        }

        setSelectedFile(file);
        setUploadStatus('idle');
        setUploadProgress(0);

        // Create preview URL for video
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('يُرجى اختيار ملف فيديو أولاً');
            return;
        }

        if (!lessonTitle.trim()) {
            toast.error('يُرجى إدخال عنوان الدرس أولاً');
            return;
        }

        setUploading(true);
        setUploadStatus('uploading');
        setUploadProgress(0);
        setUploadMessage('جاري تجهيز الرفع...');

        try {
            const formData = new FormData();
            formData.append('video', selectedFile);
            formData.append('title', lessonTitle);

            const token = Cookies.get('token');
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/video/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);

                        if (percentCompleted < 100) {
                            setUploadMessage(`جاري رفع الفيديو... ${percentCompleted}%`);
                        } else {
                            setUploadMessage('جاري معالجة الفيديو...');
                        }
                    }
                }
            );

            if (response.data.success) {
                setUploadStatus('success');
                setUploadMessage('تم رفع الفيديو بنجاح!');
                setUploadProgress(100);

                // Pass the video URL back to parent component
                if (onVideoUploaded) {
                    onVideoUploaded({
                        videoUrl: response.data.data.streamingUrl, // iframe embed URL
                        hlsUrl: response.data.data.hlsUrl, // HLS playlist URL
                        thumbnailUrl: response.data.data.thumbnailUrl,
                        bunnyStreamVideoId: response.data.data.videoId,
                        videoStatus: 'ready'
                    });
                }

                toast.success('تم رفع الفيديو بنجاح!');

                // Clear file after successful upload
                setTimeout(() => {
                    setSelectedFile(null);
                    setUploadStatus('idle');
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }, 2000);
            }

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
            setUploadMessage(error.response?.data?.message || 'حدث خطأ أثناء رفع الفيديو');
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء رفع الفيديو');
        } finally {
            setUploading(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setUploadProgress(0);
        setUploadMessage('');
        if (previewUrl && previewUrl !== currentVideoUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(currentVideoUrl);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* File Selection Area */}
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                />

                {!selectedFile ? (
                    <label
                        htmlFor="video-upload"
                        className="cursor-pointer block"
                    >
                        <div className="space-y-3">
                            <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                                <FaUpload className="text-purple-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-white font-arabicUI3 text-lg">اختر ملف فيديو</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    MP4, MPEG, MOV, AVI, WebM - حتى 2 جيجابايت
                                </p>
                            </div>
                        </div>
                    </label>
                ) : (
                    <div className="space-y-4">
                        {/* File Info */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <FaPlay className="text-purple-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-arabicUI3">{selectedFile.name}</p>
                                        <p className="text-gray-400 text-sm">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={clearSelection}
                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                    disabled={uploading}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Video Preview */}
                        {previewUrl && (
                            <div className="relative">
                                <video
                                    src={previewUrl}
                                    controls
                                    className="w-full h-48 bg-black rounded-lg object-contain"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
                {(uploading || uploadStatus !== 'idle') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-800/50 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStatus === 'success' ? 'bg-green-500/20' :
                                    uploadStatus === 'error' ? 'bg-red-500/20' :
                                        'bg-blue-500/20'
                                }`}>
                                {uploadStatus === 'success' ? (
                                    <FaCheck className="text-green-400" />
                                ) : uploadStatus === 'error' ? (
                                    <FaExclamationTriangle className="text-red-400" />
                                ) : (
                                    <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                )}
                            </div>
                            <div>
                                <p className={`font-arabicUI3 ${uploadStatus === 'success' ? 'text-green-400' :
                                        uploadStatus === 'error' ? 'text-red-400' :
                                            'text-blue-400'
                                    }`}>
                                    {uploadStatus === 'success' ? 'مكتمل' :
                                        uploadStatus === 'error' ? 'خطأ' :
                                            'جاري الرفع'}
                                </p>
                                <p className="text-gray-400 text-sm">{uploadMessage}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <motion.div
                                    className="bg-blue-500 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Button */}
            {selectedFile && uploadStatus !== 'success' && (
                <button
                    onClick={handleUpload}
                    disabled={uploading || !lessonTitle.trim()}
                    className={`w-full py-3 px-4 rounded-xl font-arabicUI3 transition-all duration-300 
                        ${uploading || !lessonTitle.trim()
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        }`}
                >
                    {uploading ? 'جاري الرفع...' : 'رفع الفيديو'}
                </button>
            )}

            {/* Instructions */}
            <div className="text-center">
                <p className="text-gray-500 text-xs">
                    يُنصح بتحسين جودة الفيديو قبل الرفع للحصول على أفضل تجربة مشاهدة
                </p>
            </div>
        </div>
    );
};

export default BunnyStreamUploader;
