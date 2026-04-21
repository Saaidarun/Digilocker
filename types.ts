
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export type Permission = 'view' | 'download';

export interface Share {
  id: string;
  docId: string;
  ownerId: string;
  sharedWithEmail: string;
  permission: Permission;
  sharedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed in real scenario
  role: UserRole;
  createdAt: string;
  storageLimit: number; // in bytes
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  isStarred: boolean;
  isDeleted: boolean;
  isFolder: boolean;
  parentId: string | null;
  uploadedAt: string;
  previewData?: string; // Base64 data for preview
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface AppState {
  users: User[];
  documents: Document[];
  shares: Share[];
  logs: ActivityLog[];
  currentUser: User | null;
}
