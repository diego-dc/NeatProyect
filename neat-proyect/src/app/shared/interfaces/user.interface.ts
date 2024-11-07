export interface UserInterface {
  email: string;
  username: string;
}

export interface UserBalanceInterface {
  user_id: string;
  balances: { [key: string]: number };
}

export interface balances {
  name: string;
  value: number;
}
