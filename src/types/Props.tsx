export type AuthUser = {
    email: string;
    password: string;
    // role?: string
};
export interface UserData {
  uid: string;
  email: string;
  name?: string;
  role?: string;
  accountType?: string,
  image?: string;
  portfolio?: PortfolioProps[],
}

export interface UserContextType {
  user: UserData | null;
  loading: boolean;
}

export enum AssetType {
  STOCK = "акція",
  CRYPTO = "криптовалюта",
  DEPOSIT = "банківський депозит",
  REAL_ESTATE = "нерухомість",
  LAND = "земля",
  OTHER = "інше",
}

export type PortfolioProps = {
    type: AssetType;
    name: string;
    quantity: number;
    price: number;
    date: Date;
    comment: string;
}