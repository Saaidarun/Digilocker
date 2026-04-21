import React, { useState } from 'react';
import { X, UserPlus, Trash2 } from 'lucide-react';
import { Permission } from '../types';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    docId: string;
    docName: string;
    store: any;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, docId, docName, store }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<Permission>('view');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isOpen) return null;

    const { state, shareDocument, revokeShare } = store;

    const handleShare = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setMessage(null);
        const result = shareDocument(docId, email, permission);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setEmail('');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const currentShares = state.shares.filter((s: any) => s.docId === docId);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold mb-1">Share "{docName}"</h2>
                <p className="text-gray-500 text-sm mb-6">Invite people to view or download this document.</p>

                <form onSubmit={handleShare} className="mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                required
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permission</label>
                                <select
                                    value={permission}
                                    onChange={(e) => setPermission(e.target.value as Permission)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="view">View Only</option>
                                    <option value="download">Can Download</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                </form>

                {currentShares.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">People with access</h3>
                        <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                            {currentShares.map((share: any) => (
                                <div key={share.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                            {share.sharedWithEmail[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{share.sharedWithEmail}</div>
                                            <div className="text-xs text-gray-500 capitalize">{share.permission}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => revokeShare(share.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Revoke access"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;
