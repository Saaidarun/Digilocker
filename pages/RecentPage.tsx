
import React from 'react';
import FileList from '../components/FileList';
import FilePreviewModal from '../components/FilePreviewModal';

interface RecentPageProps {
  store: any;
}

const RecentPage: React.FC<RecentPageProps> = ({ store }) => {
  const { state, toggleStar, softDelete } = store;
  const recentDocs = state.documents
    .filter((d: any) => d.userId === state.currentUser.id && !d.isDeleted)
    .sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = React.useState<{ name: string, previewData?: string } | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Latest Activity</h1>
        <p className="text-gray-500">Files you've worked on recently</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <FileList
          files={recentDocs}
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

export default RecentPage;
