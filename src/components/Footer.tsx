import Link from 'next/link';
import { Mail, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Логотип та опис */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-600">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ІнвестПро
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Платформа для управління інвестиціями, що допомагає приймати зважені фінансові рішення.
          </p>
        </div>

        {/* Контакти */}
        <div>
          <h4 className="text-md font-semibold mb-2">Зв’язатися з нами</h4>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4" />
            <a href="mailto:contact@investpro.ua" className="hover:underline">contact@investpro.ua</a>
          </div>
        </div>

        {/* Посилання */}
        <div>
          <h4 className="text-md font-semibold mb-2">Документи</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/privacy" className="hover:text-green-600" rel="noopener noreferrer">Політика конфіденційності</Link></li>
            <li><Link href="/terms" className="hover:text-green-600" rel="noopener noreferrer">Умови використання</Link></li>
            <li><Link href="/cookies" className="hover:text-green-600" rel="noopener noreferrer">Політика cookie</Link></li>
            <li><Link href="/register" className="hover:text-green-600" rel="noopener noreferrer">Зареєструватись</Link></li>
          </ul>
        </div>

        {/* Соцмережі */}
        <div>
          <h4 className="text-md font-semibold mb-2">Ми у соцмережах</h4>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="w-5 h-5 hover:text-green-600 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-green-600 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 hover:text-green-600 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Копірайт */}
      <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
        © ІнвестПро, 2025. Всі права захищено.
      </div>
    </footer>
  );
}
