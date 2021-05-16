export interface Column {
  id: "customerName" | "image" | "email" | "phone" | "premium" | "bid" | "sort";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export interface Data {
  customerName: string;
  image: string;
  email: string;
  phone: string;
  premium: string;
  bid: number | undefined;
}

export interface bids {
  id: string;
  carTitle: string;
  amount: number;
  created: string;
}

export interface CustomerData {
  id: string;
  firstname: string;
  lastname: string;
  avatarUrl: string;
  email: string;
  phone: string;
  hasPremium: boolean;
  bids: [
    {
      id: string;
      carTitle: string;
      amount: number;
      created: string;
    }
  ];
}
