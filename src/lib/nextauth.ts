import { doc, getDoc, setDoc } from 'firebase/firestore';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { AuthUser } from '@/types/Props';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 👇 тут робиш свій логін (наприклад, через Firebase SDK)
        const user = await signInWithEmailAndPassword(
          auth,
          credentials!.email,
          credentials!.password
        ).then((cred) => cred.user)
         .catch(() => null);

        if (!user) return null;

        // 👇 повертаєш об’єкт користувача, що піде в токен
        return { id: user.uid, email: user.email };
      }
    })
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user }) {
      try {
        const userRef = doc(db, 'users', user.id);
        const existingUser = await getDoc(userRef);

        if (!existingUser.exists()) {
          await setDoc(userRef, {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'user',
            accountType: 'Google',
            createdAt: new Date(),
            portfolio: [],
          });
          console.log('👤 Новий юзер створений у Firestore:', user.email);
        } else {
          console.log('✅ Юзер вже існує в Firestore:', user.email);
        }

        return true;
      } catch (error) {
        console.error('❌ Помилка при створенні юзера в Firestore:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      // Додаємо id у session.user
      if (session.user) {
        session.user.id = token.sub as string; // sub = унікальний id з токена
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };