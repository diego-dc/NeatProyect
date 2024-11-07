export interface CardData {
  name: string;
  value: string;
  acronym: string;
}

export interface StatusCardData {
  balance: number;
  status: 'ganancia' | 'perdida' | 'saldo';
  coinBalance: number;
  coinName: string;
}
