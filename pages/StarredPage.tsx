
import React from 'react';
import FileList from '../components/FileList';
import FilePreviewModal from '../components/FilePreviewModal';

interface StarredPageProps {
  store: any;
}

const StarredPage: React.FC<StarredPageProps> = ({ store }) => {
  const { state, toggleStar, softDelete } = store;
  const starredDocs = state.documents.filter((d: any) => d.userId === state.currentUser.id && d.isStarred && !d.isDeleted);

  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = React.useState<{ name: string, previewData?: string } | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Important Docs</h1>
        <p className="text-gray-500">Quickly access your most important items</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <FileList
          files={starredDocs}
          onToggleStar={toggleStar}
          onDelete={softDelete}
          onFileClick={(file) => {
            setSelectedDocForPreview({ name: file.fileName, previewData: file.previewData });
            setPreviewModalOpen(true);
          }}
        />
      </div>

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

export default StarredPage;
