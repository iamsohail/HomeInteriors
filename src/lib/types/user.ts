export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
}

export interface ProjectMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: "owner" | "editor" | "viewer";
  addedAt: Date;
}
