import React from 'react';
import { AppState, UserRole, User, Document, ActivityLog, Share, Permission } from './types';
import { STORAGE_LIMIT_DEFAULT } from './constants';

const API_URL = 'http://localhost:3001/api';

const generateDefaultDocuments = (userId: string): Document[] => {
  const docs: Document[] = [];
  const now = new Date().toISOString();

  const createDoc = (name: string, isFolder: boolean, parentId: string | null = null): Document => ({
    id: Math.random().toString(36).substr(2, 9),
    userId,
    fileName: name,
    fileType: isFolder ? 'folder' : 'pdf',
    fileSize: isFolder ? 0 : 1024 * 10,
    isStarred: false,
    isDeleted: false,
    isFolder,
    parentId,
    uploadedAt: now
  });

  const categories = {
    'Identity Documents': ['Aadhaar Card', 'PAN Card', 'Voter ID (EPIC)', 'Passport'],
    'Address / Residence Proof': ['Aadhaar Card', 'Voter ID', 'Passport', 'Ration Card', 'Electricity / Water Bill (Govt-issued)', 'Driving Licence'],
    'Family & Personal Certificates': ['Birth Certificate', 'Death Certificate', 'Marriage Certificate', 'Caste Certificate', 'Community Certificate', 'Income Certificate', 'Residence / Domicile Certificate'],
    'Education Documents': ['SSLC / 10th Mark Sheet', 'HSC / 12th Mark Sheet', 'Degree / Diploma Certificates', 'Transfer Certificate (TC)', 'Bonafide Certificate'],
    'Transport Documents': ['Driving Licence (DL)', 'Vehicle Registration Certificate (RC)', 'Pollution Under Control (PUC)', 'Vehicle Insurance (Govt-verified)'],
    'Financial & Tax Documents': ['PAN Card', 'Income Tax Returns (ITR)', 'GST Registration Certificate', 'Bank Passbook (Govt Banks)', 'Pension Payment Order (PPO)'],
    'Health & Welfare': ['Ayushman Bharat Card', 'Health Insurance Scheme Cards (State/Central)', 'Disability Certificate'],
    'Employment & Social Security': ['Employment Exchange Card', 'E-Shram Card', 'MNREGA Job Card', 'Pension ID (Old age / Widow / Disability)'],
    'Other Important Documents': ['Ration Card (PDS)', 'Property Documents (Patta, Chitta, EC)', 'Arms Licence (if applicable)']
  };

  // Create "My Documents" folder
  const myDocsFolder = createDoc('My Documents', true, null);
  docs.push(myDocsFolder);

  Object.entries(categories).forEach(([category, files]) => {
    const catFolder = createDoc(category, true, myDocsFolder.id);
    docs.push(catFolder);
    files.forEach(file => {
      docs.push(createDoc(file, false, catFolder.id));
    });
  });

  return docs;
};

const getInitialState = (): AppState => {
  return {
    users: [],
    documents: [],
    shares: [],
    logs: [],
    currentUser: null
  };
};

export const useStore = () => {
  const [state, setState] = React.useState<AppState>(getInitialState());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoaded, setIsLoaded] = React.useState(false);

  const fetchState = async () => {
    try {
      const res = await fetch(`${API_URL}/bootstrap`);
      if (res.ok) {
        const data = await res.json();
        setState(prev => ({ ...prev, ...data, currentUser: prev.currentUser })); // Keep currentUser if already set, or logic to persist login
        setIsLoaded(true);
      }
    } catch (err) {
      console.error("Failed to fetch state", err);
    }
  };

  // Load from API on mount
  React.useEffect(() => {
    fetchState();
  }, []);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const newState = updater(prev);
      return newState;
    });
  };

  const logAction = async (userId: string, userName: string, action: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      action,
      timestamp: new Date().toISOString()
    };

    // Optimistic UI update
    updateState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 100)
    }));

    // API call
    try {
      await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
    } catch (e) {
      console.error("Failed to log action", e);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        updateState(prev => ({ ...prev, currentUser: user }));
        logAction(user.id, user.name, 'User Logged In');
        return { user };
      } else if (res.status === 403) {
        return { error: 'Account pending approval' };
      } else if (res.status === 401) {
        return { error: 'Invalid email or password' };
      }
    } catch (e) {
      console.error("Login failed", e);
    }
    return { error: 'Login failed' };
  };

  const approveUser = async (userId: string) => {
    try {
      await fetch(`${API_URL}/users/${userId}/approve`, { method: 'PATCH' });
      // Optimistic update
      updateState(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userId ? { ...u, isApproved: 1 } : u)
      }));
    } catch (e) { console.error(e); }
  };

  const rejectUser = async (userId: string) => {
    try {
      await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
      // Optimistic update
      updateState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== userId)
      }));
    } catch (e) { console.error(e); }
  };

  const logout = () => {
    if (state.currentUser) {
      logAction(state.currentUser.id, state.currentUser.name, 'User Logged Out');
    }
    updateState(prev => ({ ...prev, currentUser: null }));
  };

  const register = async (name: string, email: string, pass: string) => {
    // Check local state first to avoid duplicate calls if needed, but server should handle it
    // Server check

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: pass,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      storageLimit: STORAGE_LIMIT_DEFAULT
    };

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        // Generate default docs and sync them
        const defaultDocs = generateDefaultDocuments(newUser.id);

        // We'll upload them one by one or we could add a bulk endpoint. 
        // For simplicity, just loop.
        for (const doc of defaultDocs) {
          await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doc)
          });
        }

        // Refresh state
        await fetchState();

        updateState(prev => ({
          ...prev,
          users: [...prev.users, newUser],
          currentUser: newUser
        }));

        logAction(newUser.id, newUser.name, 'User Registered');
        return true;
      }
    } catch (e) {
      console.error("Register failed", e);
    }

    return false;
  };

  const uploadFile = async (file: File, parentId: string | null = null) => {
    if (!state.currentUser) return;

    // Determine file type based on extension or mime type
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType = 'unknown';

    const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
    const isPdf = file.type === 'application/pdf' || ext === 'pdf';
    const isVideo = file.type.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext);
    const isAudio = file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
    const isText = file.type.startsWith('text/') || ['txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'xml', 'csv'].includes(ext);
    const isDoc = file.type.includes('word') || ['doc', 'docx', 'odt', 'rtf'].includes(ext);

    if (isImage) fileType = ext;
    else if (isPdf) fileType = 'pdf';
    else if (isVideo) fileType = 'video';
    else if (isAudio) fileType = 'audio';
    else if (isText) fileType = 'text';
    else if (isDoc) fileType = 'doc';
    else fileType = ext;

    const createAndSaveDoc = async (previewData?: string) => {
      const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        userId: state.currentUser!.id,
        fileName: file.name,
        fileType: fileType,
        fileSize: file.size,
        isStarred: false,
        isDeleted: false,
        isFolder: false,
        parentId,
        uploadedAt: new Date().toISOString(),
        previewData: previewData
      };

      try {
        const res = await fetch(`${API_URL}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDoc)
        });

        if (res.ok) {
          updateState(prev => ({
            ...prev,
            documents: [...prev.documents, newDoc]
          }));
          logAction(state.currentUser!.id, state.currentUser!.name, `Uploaded file: ${file.name}`);
        }
      } catch (e) {
        console.error("Upload failed", e);
      }
    };

    const MAX_PREVIEW_SIZE = 50 * 1024 * 1024; // 50MB

    if (file.size <= MAX_PREVIEW_SIZE) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        createAndSaveDoc(result);
      };
      reader.onerror = () => {
        console.error("Failed to read file!");
        createAndSaveDoc();
      }
      reader.readAsDataURL(file);
    } else {
      createAndSaveDoc();
    }
  };

  const createFolder = async (name: string, parentId: string | null = null) => {
    if (!state.currentUser) return;

    const newFolder: Document = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      fileName: name,
      fileType: 'folder',
      fileSize: 0,
      isStarred: false,
      isDeleted: false,
      isFolder: true,
      parentId,
      uploadedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFolder)
      });
      if (res.ok) {
        updateState(prev => ({
          ...prev,
          documents: [...prev.documents, newFolder]
        }));
        logAction(state.currentUser!.id, state.currentUser!.name, `Created folder: ${name}`);
      }
    } catch (e) { console.error(e); }
  };

  const toggleStar = async (docId: string) => {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) return;
    const newVal = !doc.isStarred;

    // Optimistic
    updateState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, isStarred: newVal } : d)
    }));

    try {
      await fetch(`${API_URL}/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStarred: newVal })
      });
    } catch (e) { console.error(e); }
  };

  const softDelete = async (docId: string) => {
    // Optimistic
    updateState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, isDeleted: true } : d)
    }));

    try {
      await fetch(`${API_URL}/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
      });
    } catch (e) { console.error(e); }
  };

  const restoreDoc = async (docId: string) => {
    // Optimistic
    updateState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, isDeleted: false } : d)
    }));

    try {
      await fetch(`${API_URL}/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: false })
      });
    } catch (e) { console.error(e); }
  };

  const permanentDelete = async (docId: string) => {
    updateState(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    }));

    try {
      await fetch(`${API_URL}/documents/${docId}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  const shareDocument = async (docId: string, email: string, permission: Permission) => {
    if (!state.currentUser) return { success: false, message: 'Not logged in' };

    // Check if user exists (server side check is better but for now keep consistent with flow)
    // We already have users loaded in state.
    const targetUser = state.users.find(u => u.email === email);
    if (!targetUser) return { success: false, message: 'User not found' };

    if (targetUser.id === state.currentUser.id) return { success: false, message: 'Cannot share with yourself' };

    // Check if already shared
    const existingShare = state.shares.find(s => s.docId === docId && s.sharedWithEmail === email);
    if (existingShare) {
      // Permission update is not implemented in backend PATCH for shares, simplified for now to strict create/delete
      return { success: false, message: 'Already shared' };
      // Plan didn't specifying Share update endpoint, just create/delete. 
    }

    const newShare: Share = {
      id: Math.random().toString(36).substr(2, 9),
      docId,
      ownerId: state.currentUser.id,
      sharedWithEmail: email,
      permission,
      sharedAt: new Date().toISOString()
    };

    updateState(prev => ({
      ...prev,
      shares: [...prev.shares, newShare]
    }));

    try {
      await fetch(`${API_URL}/shares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShare)
      });

      logAction(state.currentUser.id, state.currentUser.name, `Shared doc ${docId} with ${email}`);
      return { success: true, message: 'Document shared successfully' };
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Failed to share' };
    }
  };

  const revokeShare = async (shareId: string) => {
    updateState(prev => ({
      ...prev,
      shares: prev.shares.filter(s => s.id !== shareId)
    }));
    try {
      await fetch(`${API_URL}/shares/${shareId}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  const getSharedDocuments = () => {
    if (!state.currentUser) return [];
    const myEmail = state.currentUser.email;

    return state.shares
      .filter(s => s.sharedWithEmail === myEmail)
      .map(share => {
        const doc = state.documents.find(d => d.id === share.docId);
        const owner = state.users.find(u => u.id === share.ownerId);
        if (!doc || !owner || doc.isDeleted) return null;

        return {
          ...doc,
          sharedBy: owner.name,
          permission: share.permission,
          shareId: share.id
        };
      })
      .filter(d => d !== null);
  };

  return {
    state,
    login,
    logout,
    register,
    uploadFile,
    createFolder,
    toggleStar,
    softDelete,
    restoreDoc,
    permanentDelete,
    shareDocument,
    revokeShare,
    getSharedDocuments,
    searchQuery,
    setSearchQuery,
    approveUser,
    rejectUser
  };
};