
import React from 'react';
import FileList from '../components/FileList';

interface TrashPageProps {
  store: any;
}

const TrashPage: React.FC<TrashPageProps> = ({ store }) => {
  const { state, restoreDoc, permanentDelete } = store;
  const trashDocs = state.documents.filter((d: any) => d.userId === state.currentUser.id && d.isDeleted);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
          <p className="text-gray-500">Items are kept here for 30 days before permanent deletion</p>
        </div>
        <button
          onClick={() => trashDocs.forEach((d: any) => permanentDelete(d.id))}
          className="text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          Empty Recycle Bin
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <FileList
          files={trashDocs}
          onRestore={restoreDoc}
          onPermanentDelete={permanentDelete}
        />
      </div>
    </div>
  );
};

export default TrashPage;
