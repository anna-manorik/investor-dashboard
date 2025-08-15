'use client';

import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { signOut as firebaseSignOut } from "firebase/auth";
import Image from "next/image";
import { useUser } from "../context/UserContext";
import { auth } from '@/lib/firebase';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

export default function Settings() {
    const { data: session } = useSession();
    const { user, loading } = useUser();
    const router = useRouter();

    const currentUser = session?.user || user

    const handleSignOut = () => {
        try{
            if(session) {
            nextAuthSignOut({callbackUrl: "/login"})
            } else if (currentUser) {
                firebaseSignOut(auth)
                // navigate('/login')
            }
            toast.success('You have logged out succesfully!')
            router.push('/login')
        } catch {
            toast.error('Opps, you cant log out ')
            console.error('Error during logout')
        }
    }
    
    return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Профіль користувача</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-grey-400 shadow-md rounded-lg overflow-hidden">
          <tbody>
            <tr className="border-b">
              <td colSpan={2} className="p-4 text-center mx-auto">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    Н/Д
                  </div>
                )}
              </td>
            </tr>

            <tr className="border-b">
              <td className="p-4 font-semibold">Ім’я</td>
              <td className="p-4">{user?.name ?? 'Невідомо'}</td>
            </tr>

            <tr className="border-b">
              <td className="p-4 font-semibold">Email (акаунт)</td>
              <td className="p-4">{user?.email ?? 'Невідомо'}</td>
            </tr>

            <tr className="border-b">
              <td className="p-4 font-semibold">Тип акаунту</td>
              <td className="p-4">{user?.accountType}</td>
              {/* Якщо реалізуєш тип акаунту вручну — тут можна вставити значення */}
            </tr>

            <tr>
              <td className="p-4 font-semibold">Дата реєстрації</td>
              <td className="p-4">–</td>
              {/* Потрібно зберігати дату при реєстрації у БД, якщо хочеш виводити */}
            </tr>
          </tbody>
        </table>
          <button onClick={handleSignOut} className="text-red-600 hover:underline text-xl">Вийти з акаунту</button>
      </div>
    </div>

      </main>
    </div>
  );
}
