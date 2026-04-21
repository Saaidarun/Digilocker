import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronRight,
  FolderPlus,
  FileUp,
  Home,
  ChevronDown,
  Check,
  Upload,
  Folder
} from 'lucide-react';
import FileList from '../components/FileList';
import ShareModal from '../components/ShareModal';
import FilePreviewModal from '../components/FilePreviewModal';

interface MyDrivePageProps {
  store: any;
}

type FileTypeFilter = 'all' | 'folder' | 'pdf' | 'image' | 'doc';

const MyDrivePage: React.FC<MyDrivePageProps> = ({ store }) => {
  const { state, toggleStar, softDelete, createFolder, uploadFile } = store;
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isDriveMenuOpen, setIsDriveMenuOpen] = useState(false);
  const driveMenuRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>('all');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocForShare, setSelectedDocForShare] = useState<{ id: string, name: string } | null>(null);

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<{ name: string } | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (driveMenuRef.current && !driveMenuRef.current.contains(event.target as Node)) {
        setIsDriveMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current folder items
  const folderDocs = useMemo(() => {
    return state.documents.filter((d: any) =>
      d.userId === state.currentUser.id &&
      !d.isDeleted &&
      d.parentId === currentFolderId
    );
  }, [state.documents, state.currentUser.id, currentFolderId]);

  // Apply filters and search
  const userDocs = useMemo(() => {
    let docs = folderDocs;

    // Search filter
    if (store.searchQuery) {
      // If searching, look through ALL user documents, not just current folder
      docs = state.documents.filter((d: any) =>
        d.userId === state.currentUser.id &&
        !d.isDeleted &&
        d.fileName.toLowerCase().includes(store.searchQuery.toLowerCase())
      );
    }

    if (typeFilter === 'all') return docs;
    return docs.filter((d: any) => {
      if (typeFilter === 'folder') return d.isFolder;
      if (typeFilter === 'pdf') return d.fileType.toLowerCase() === 'pdf';
      if (typeFilter === 'image') return ['jpg', 'png', 'jpeg', 'gif'].includes(d.fileType.toLowerCase());
      if (typeFilter === 'doc') return ['doc', 'docx'].includes(d.fileType.toLowerCase());
      return true;
    });
  }, [folderDocs, typeFilter, store.searchQuery, state.documents, state.currentUser.id]);

  const breadcrumbs = useMemo(() => {
    const crumbs = [];
    let tempId = currentFolderId;
    while (tempId) {
      const folder = state.documents.find((d: any) => d.id === tempId);
      if (folder) {
        crumbs.unshift(folder);
        tempId = folder.parentId;
      } else {
        tempId = null;
      }
    }
    return crumbs;
  }, [currentFolderId, state.documents]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0], currentFolderId);
      setIsDriveMenuOpen(false);
    }
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      createFolder(name, currentFolderId);
      setIsDriveMenuOpen(false);
    }
  };

  const handleDownloadFile = (file: any) => {
    if (!file.previewData) {
      alert("File content not available for download.");
      return;
    }

    try {
      // Try to create a blob for better download handling
      const arr = file.previewData.split(',');
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
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.error("Download blob creation failed", e);
    }

    // Fallback
    const link = document.createElement('a');
    link.href = file.previewData;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterOptions: { label: string, value: FileTypeFilter }[] = [
    { label: 'All types', value: 'all' },
    { label: 'Folders', value: 'folder' },
    { label: 'PDFs', value: 'pdf' },
    { label: 'Images', value: 'image' },
    { label: 'Documents', value: 'doc' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-4">
        {/* Title and Main Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative" ref={driveMenuRef}>
            <button
              onClick={() => setIsDriveMenuOpen(!isDriveMenuOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <h1 className="text-2xl text-gray-800">My Locker</h1>
              <ChevronDown className={`w-5 h-5 text-gray-600 mt-1 transition-transform ${isDriveMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDriveMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={handleCreateFolder}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FolderPlus className="w-5 h-5 text-gray-500" />
                  <span>New folder</span>
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
                <label className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors">
                  <FileUp className="w-5 h-5 text-gray-500" />
                  <span>File upload</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
                <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span>Folder upload</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Secondary upload button for convenience */}
            <label className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
              <FileUp className="w-4 h-4" />
              <span>Upload</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          <div className="relative">
            <button
              onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap ${typeFilter !== 'all' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white'}`}
            >
              <span>Type</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isTypeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-2">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTypeFilter(opt.value);
                      setIsTypeMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    {typeFilter === opt.value && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
            <span>People</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
            <span>Modified</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
            <span>Source</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {typeFilter !== 'all' && (
            <button
              onClick={() => setTypeFilter('all')}
              className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center space-x-1 text-sm text-gray-500 overflow-x-auto whitespace-nowrap pb-2 mb-2 border-b border-gray-100">
          <button
            onClick={() => setCurrentFolderId(null)}
            className={`hover:bg-gray-100 px-3 py-1 rounded-full transition-colors flex items-center ${!currentFolderId ? 'text-gray-900 font-bold bg-gray-50' : ''}`}
          >
            My Locker
          </button>

          {breadcrumbs.map((folder: any, idx) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-300 mx-1" />
              <button
                onClick={() => setCurrentFolderId(folder.id)}
                className={`hover:bg-gray-100 px-3 py-1 rounded-full transition-colors ${idx === breadcrumbs.length - 1 ? 'text-gray-900 font-bold bg-gray-50' : ''}`}
              >
                {folder.fileName}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </header>

      {/* Main File Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <FileList
          files={userDocs}
          onToggleStar={toggleStar}
          onDelete={softDelete}
          onFolderClick={(id) => {
            setCurrentFolderId(id);
            setTypeFilter('all');
            setIsDriveMenuOpen(false);
          }}
          onShare={(file) => {
            setSelectedDocForShare({ id: file.id, name: file.fileName });
            setShareModalOpen(true);
          }}
          onFileClick={(file) => {
            setSelectedDocForPreview({ name: file.fileName, previewData: file.previewData });
            setPreviewModalOpen(true);
          }}
          onDownload={handleDownloadFile}
        />
      </div>

      {selectedDocForShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          docId={selectedDocForShare.id}
          docName={selectedDocForShare.name}
          store={store}
        />
      )}

      {selectedDocForPreview && (
        <FilePreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          fileName={selectedDocForPreview.name}
          previewData={selectedDocForPreview.previewData}
        />
      )}
    </div>
  );
};

export default MyDrivePage;