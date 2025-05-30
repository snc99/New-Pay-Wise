export interface Payment {
  id: string;
  amount: number;
  remaining: number;
  paidAt: string;
  createdAt: string;
  debt: {
    user: {
      name: string;
    };
  };
}
