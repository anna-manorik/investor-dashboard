'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLink = usePathname()

  console.log('11111', currentLink)

  const navLinks = [
    { name: 'Головна', href: '/' },
    { name: 'Портфель', href: '/portfolio' },
    { name: 'Блог', href: '/blog' },
    { name: 'Налаштування', href: '/settings' },
  ];

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
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={currentLink === link.href 
            ? 'text-green-600 transition' 
            : 'text-gray-700 hover:text-green-600 transition'}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Кнопка входу */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Увійти / Кабінет
          </Link>
        </div>

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
          {navLinks.map((link) => (
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
          <Link
            href="/login"
            className="block mt-2 bg-green-600 text-white px-4 py-2 rounded-xl text-center hover:bg-green-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Увійти / Кабінет
          </Link>
        </div>
      )}
    </header>
  );
}
