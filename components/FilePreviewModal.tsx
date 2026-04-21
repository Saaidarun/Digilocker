import React from 'react';
import { X, FileText, Download, Image as ImageIcon, Film, ExternalLink } from 'lucide-react';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    fileSize?: number;
    previewData?: string;
}

const PdfViewer: React.FC<{ previewData: string, fileName: string }> = ({ previewData, fileName }) => {
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!previewData) return;

        try {
            const arr = previewData.split(',');
            if (arr.length < 2) return;

            const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const blob = new Blob([u8arr], { type: mime });
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        } catch (e) {
            console.error("Failed to create blob for PDF", e);
        }
    }, [previewData]);

    if (!blobUrl) {
        return <div className="flex items-center justify-center h-full text-gray-500">Loading PDF...</div>;
    }

    return (
        <iframe
            src={blobUrl}
            title={fileName}
            className="w-full h-full border-0"
        />
    );
};

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
    isOpen,
    onClose,
    fileName,
    previewData,
    fileSize
}) => {
    // State to track if image failed to load even with data
    const [imgError, setImgError] = React.useState(false);

    // Reset error when file changes
    React.useEffect(() => {
        setImgError(false);
    }, [fileName, previewData]);

    const handleOpenNewTab = () => {
        if (!previewData) return;

        // Convert base64 to blob for cleaner opening
        try {
            // Check if it's a data URL
            const arr = previewData.split(',');
            if (arr.length < 2) return; // invalid data

            const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const blob = new Blob([u8arr], { type: mime });
            const url = URL.createObjectURL(blob);

            // Open the blob URL
            window.open(url, '_blank');

            // Note: We can't revoke the URL immediately because the new tab might need it.
            // In a real app we'd track these and revoke on unmount, but for this demo 
            // letting browser clean up on refresh is acceptable.
        } catch (e) {
            console.error("Failed to open blob", e);
            // Fallback to naive open if blob fails
            const w = window.open();
            if (w) {
                w.document.write('<iframe width="100%" height="100%" src="' + previewData + '"></iframe>');
            }
        }
    };

    const handleDownload = () => {
        if (!previewData) return;

        try {
            // Try to create a blob for better download handling of large files
            const arr = previewData.split(',');
            if (arr.length >= 2) {
                const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                return;
            }
        } catch (e) {
            console.error("Download blob creation failed, falling back to direct data attribute", e);
        }

        // Fallback
        const link = document.createElement('a');
        link.href = previewData;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
    const isPdf = ['pdf'].includes(ext);
    const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext);
    const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
    const isText = ['txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'xml', 'csv'].includes(ext);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[95vw] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">


                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            {isImage ? <ImageIcon className="w-5 h-5" /> :
                                isVideo ? <Film className="w-5 h-5" /> :
                                    isAudio ? <Film className="w-5 h-5" /> :
                                        <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{fileName}</h3>
                            <p className="text-xs text-gray-500">Preview Mode</p>
                        </div>
                    </div>
                    {/* ... buttons ... */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleOpenNewTab}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Open in New Tab"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-gray-100 overflow-y-auto p-4 flex justify-center items-center">

                    {isImage && previewData ? (
                        <div className="flex items-center justify-center w-full h-full p-2">
                            <img
                                src={previewData}
                                alt={fileName}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                onError={() => setImgError(true)}
                            />
                        </div>
                    ) : isVideo && previewData ? (
                        <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                            <video
                                controls
                                className="max-w-full max-h-full"
                                src={previewData} // Data URL works for small videos, but blob is better. We rely on store passing Data URL.
                            />
                        </div>
                    ) : isAudio && previewData ? (
                        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Film className="w-10 h-10 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-medium mb-4 text-center">{fileName}</h4>
                            <audio
                                controls
                                className="w-full"
                                src={previewData}
                            />
                        </div>
                    ) : isText && previewData ? (
                        <div className="w-full h-full bg-white rounded-lg shadow p-4 overflow-auto">
                            <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                                {/* Decode base64 if it's a data URL, otherwise showing raw might be weird */}
                                {(() => {
                                    try {
                                        const parts = previewData.split(',');
                                        return parts.length > 1 ? atob(parts[1]) : previewData;
                                    } catch (e) {
                                        return "Error decoding text content.";
                                    }
                                })()}
                            </pre>
                        </div>
                    ) : isPdf && previewData ? (
                        <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                            <PdfViewer previewData={previewData} fileName={fileName} />
                        </div>
                    ) : (
                        <div className="bg-white shadow-lg w-full max-w-2xl min-h-full p-12 flex flex-col items-center justify-center">
                            <div className="bg-gray-50 rounded-full p-6 mb-4">
                                <FileText className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Preview Not Available</h3>
                            <p className="text-center text-gray-500 max-w-md mb-8">
                                This file type cannot be previewed directly in the browser, or the file is empty/corrupted.
                            </p>
                            <button
                                onClick={handleDownload}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                <span>Download File</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">{fileName}</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FilePreviewModal;
