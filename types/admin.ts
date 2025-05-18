export interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "ADMIN" | "SUPERADMIN";
  createdAt: string;
}
