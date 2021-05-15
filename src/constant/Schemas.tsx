export interface Column {
  id: "customerName" | "image" | "email" | "phone" | "premium" | "bid";
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
  premium: Boolean;
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
