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
}

export interface UserContextType {
  user: UserData | null;
  loading: boolean;
}