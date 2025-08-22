"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

type UserContextType = {
  id?: string,
  user: any;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  id: '',
  user: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  return (
    <UserContext.Provider
      value={{ id: session?.user?.id ?? '', user: session?.user ?? null, loading: status === "loading" }}
    >
      {children}
    </UserContext.Provider>
  );
};