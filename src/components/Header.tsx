'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut as nextAuthSignOut, useSession } from 'next-auth/react';
import { signOut as firebaseSignOut } from "firebase/auth";
import { useUser } from '@/app/context/UserContext';
import { auth } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { navLinks } from '@/app/utils/NavLinks'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLink = usePathname();
  const { data: session } = useSession();
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    try{
      if (session) {
        nextAuthSignOut()
      } else if (user) {
        firebaseSignOut(auth)
      }
      toast.success('You have logged out succesfully!')
      router.push('/login')
    } catch {
      toast.error('Opps, you cant log out ')
      console.error('Error during logout')
    }
    
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-600">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ІнвестПро
        </Link>

        {/* Навігація */}
        <nav className="hidden md:flex gap-6">
          {session !== null || user
          ? navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={currentLink === link.href 
            ? 'text-green-600 transition' 
            : 'text-gray-700 hover:text-green-600 transition'}>
              {link.name}
            </Link>
          ))
        : navLinks.filter((link) => link.visibility === 'all').map((link) => (
            <Link key={link.href} href={link.href} className={currentLink === link.href 
            ? 'text-green-600 transition' 
            : 'text-gray-700 hover:text-green-600 transition'}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Кнопка входу */}
        {session || user 
        ? <div className="flex items-center text-grey-800 hidden md:block">
                        <p className="text-grey-800">Привіт, {session ? session.user?.name : user?.email}</p><br></br>
                        <button onClick={handleSignOut} className="text-red-600 hover:underline">Вийти</button>
                      </div>
        : 
        <div className="hidden md:block">
          <Link
            href="/login"
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Увійти / Кабінет
          </Link>
        </div>
        }
        

        {/* Мобільне меню */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Відкрити меню"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Мобільне меню випадає */}
      {menuOpen && (
        <div className="absolute bg-white md:hidden px-4 pb-4 space-y-2 ">
          {session !== null || user
          ? navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={currentLink === link.href 
                ? "block text-green-600 transition" 
                : "block text-gray-700 hover:text-green-600 transition"}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))
          : navLinks.filter((link) => link.visibility === 'all').map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={currentLink === link.href 
                ? "block text-green-600 transition" 
                : "block text-gray-700 hover:text-green-600 transition"}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {session || user 
          ? <div className="flex items-center text-grey-800 md:hidden">
                          <p className="text-grey-800">Привіт, {session ? session.user?.name : user?.email}</p><br></br>
                          <button onClick={handleSignOut} className="text-red-600 hover:underline">Вийти</button>
                        </div>
          : 
            <Link
              href="/login"
              className="block mt-2 bg-green-600 text-white px-4 py-2 rounded-xl text-center hover:bg-green-700 transition"
              onClick={() => setMenuOpen(false)}
            >
              Увійти / Кабінет
            </Link>
          }
        </div>
      )}

                      
    </header>
  );
}
