import { doc, getDoc, setDoc } from 'firebase/firestore';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from "@/lib/firebase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        const userRef = doc(db, 'users', user.id);
        const existingUser = await getDoc(userRef);

        if (!existingUser.exists()) {
          await setDoc(userRef, {
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
  },
  
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };