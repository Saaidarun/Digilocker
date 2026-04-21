import React, { useMemo, useState } from 'react';
import { Share2, Download, Eye, Ban } from 'lucide-react';
import { Document, Permission } from '../types';
import FilePreviewModal from '../components/FilePreviewModal';

interface SharedWithMePageProps {
    store: any;
}

interface SharedDocument extends Document {
    sharedBy: string;
    permission: Permission;
    shareId: string;
}

const SharedWithMePage: React.FC<SharedWithMePageProps> = ({ store }) => {
    const { getSharedDocuments } = store;
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedDocForPreview, setSelectedDocForPreview] = useState<{ name: string } | null>(null);

    // Fetch shared docs
    const sharedDocs: SharedDocument[] = useMemo(() => {
        let docs = getSharedDocuments();
        if (store.searchQuery) {
            docs = docs.filter((d: any) => d.fileName.toLowerCase().includes(store.searchQuery.toLowerCase()));
        }
        return docs;
    }, [store.state.shares, store.state.documents, store.searchQuery]); // Re-run when shares or search change

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <Share2 className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl text-gray-800 font-semibold">Received Docs</h1>
                </div>
                <p className="text-gray-500 text-sm">Documents shared with you by other users</p>
            </header>

            {sharedDocs.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No documents received yet</h3>
                    <p className="text-gray-500 mt-1">When someone shares a document with you, it will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4 w-[40%]">Name</th>
                                <th className="px-6 py-4 w-[25%]">Shared By</th>
                                <th className="px-6 py-4 w-[15%]">Permission</th>
                                <th className="px-6 py-4 w-[20%] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sharedDocs.map((doc) => (
                                <tr key={doc.shareId} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                                                <span className="text-xs font-bold">PDF</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {doc.fileName}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {(doc.fileSize / 1024).toFixed(1)} KB
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                                                {doc.sharedBy[0].toUpperCase()}
                                            </div>
                                            <span className="text-sm text-gray-600">{doc.sharedBy}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.permission === 'download'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {doc.permission === 'download' ? 'Can Download' : 'View Only'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View"
                                                onClick={() => {
                                                    setSelectedDocForPreview({ name: doc.fileName });
                                                    setPreviewModalOpen(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {doc.permission === 'download' ? (
                                                <button
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="p-2 text-gray-300 cursor-not-allowed"
                                                    title="Download Restricted"
                                                    disabled
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedDocForPreview && (
                <FilePreviewModal
                    isOpen={previewModalOpen}
                    onClose={() => setPreviewModalOpen(false)}
                    fileName={selectedDocForPreview.name}
                />
            )}
        </div>
    );
};

export default SharedWithMePage;
