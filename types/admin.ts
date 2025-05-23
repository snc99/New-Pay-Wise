// types/admin.ts
export interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt?: string;
}
