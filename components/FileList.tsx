import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Star,
  Trash2,
  Download,
  RotateCcw,
  Ban,
  Folder,
  Share2
} from 'lucide-react';
import { Document } from '../types';
import { FILE_TYPE_ICONS } from '../constants';

interface FileListProps {
  files: Document[];
  onToggleStar?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onFolderClick?: (id: string) => void;
  onFileClick?: (file: Document) => void;
  onShare?: (file: Document) => void;
  onDownload?: (file: Document) => void;
  isAdmin?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onToggleStar,
  onDelete,
  onRestore,
  onPermanentDelete,
  onFolderClick,
  onFileClick,
  onShare,
  onDownload,
  isAdmin = false
}) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '—';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (file: Document) => {
    if (file.isFolder) return Folder;
    const t = file.fileType.toLowerCase();
    if (['jpg', 'png', 'jpeg', 'gif'].includes(t)) return ImageIcon;
    if (['pdf', 'doc', 'docx'].includes(t)) return FileText;
    return FileIcon;
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <FileIcon className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg">No items found</p>
      </div>
    );
  }

  // Sort folders first
  const sortedFiles = [...files].sort((a, b) => {
    if (a.isFolder === b.isFolder) return a.fileName.localeCompare(b.fileName);
    return a.isFolder ? -1 : 1;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-500">Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-500">Date Modified</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-500">Size</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map((file) => {
            const Icon = getIcon(file);

            return (
              <tr
                key={file.id}
                className="group hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                onClick={() => {
                  if (file.isFolder && onFolderClick) {
                    onFolderClick(file.id);
                  } else if (!file.isFolder && onFileClick) {
                    onFileClick(file);
                  }
                }}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100 ${file.isFolder ? 'text-blue-500' : (FILE_TYPE_ICONS[file.fileType] || FILE_TYPE_ICONS.default)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 block truncate max-w-xs">{file.fileName}</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{file.isFolder ? 'Folder' : file.fileType}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {formatSize(file.fileSize)}
                </td>
                <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    {!file.isDeleted && onToggleStar && (
                      <button
                        onClick={() => onToggleStar(file.id)}
                        className={`p-1.5 rounded-lg transition-colors ${file.isStarred ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Star"
                      >
                        <Star className={`w-4 h-4 ${file.isStarred ? 'fill-current' : ''}`} />
                      </button>
                    )}

                    {!file.isDeleted && !file.isFolder && onShare && (
                      <button
                        onClick={() => onShare(file)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}

                    {!file.isDeleted && !file.isFolder && onDownload && (
                      <button
                        onClick={() => onDownload(file)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    {file.isDeleted ? (
                      <>
                        <button
                          onClick={() => onRestore && onRestore(file.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPermanentDelete && onPermanentDelete(file.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Permanently"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onDelete && onDelete(file.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Move to Recycle Bin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
