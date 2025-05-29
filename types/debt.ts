// types/debt.ts

export interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Debt {
  id: string;
  userId: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;

  user: User; // jika di tabel ada properti ini
}
