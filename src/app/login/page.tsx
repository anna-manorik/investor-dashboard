'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AuthUser } from '@/types/Props';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUser } from '../context/UserContext';
// import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object({
    email: Yup.string()
      .email('invalid email')
      .required('*required'),
    password: Yup.string()
      .min(6, 'min 6 symbols')
      .required('*required'),
  });

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { data: session } = useSession();
    const router = useRouter();
    
    const handleLogin = async (values: AuthUser, actions: FormikHelpers<AuthUser>) => {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        actions.resetForm();
        toast.success(`Welcome, ${values.email}! You was logged!`);
        router.push('/')
    };

    const handleSigninGoogle = () => {
        signIn('google');
        router.push('/')
    }
    
    return (
        <div className='flex flex-col items-center'>
        <p className='text-white mb-5'>Увійдіть або зареєструйтесь</p>
        <Formik initialValues={{email: '', password: ''}} onSubmit={(values, actions) => {handleLogin(values, actions)}} validationSchema={validationSchema}>
                    <Form className="flex flex-col mb-10 max-w-md mx-auto p-4 bg-white rounded shadow-md text-gray-900">
                        <Field as="input" name="email" type="email" placeholder="email" className="h-10 border-4 border-yellow-400" />
                        <ErrorMessage name="login" component="div" className="text-red-500 text-sm" />
                        <div className="relative">
                            <Field as="input" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" className="h-10 border-4 border-yellow-400" />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900"
                            >
                                {showPassword 
                                ? (<EyeSlashIcon className="h-5 w-5" />) 
                                : (<EyeIcon className="h-5 w-5" />)}
                            </button>
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                        </div>

                        <button type="submit" onClick={() => handleLogin} className="h-10 border-4 border-yellow-400 rounded-xl bg-yellow-300 font-bold">LOG IN</button>
                        
                    </Form>
                </Formik>
                {/* {session ? (
                    <div className="flex items-center gap-4">
                    <p>Привіт, {session.user?.name}</p>
                    <button onClick={() => signOut()} className="text-red-600 hover:underline">Вийти</button>
                    </div>
                ) : ( */}
                    <button onClick={handleSigninGoogle} className="w-100 bg-blue-600 text-white px-4 py-2 rounded-md mb-3">
                    Увійти через Google
                    </button>
                 {/* )} */}
                <Link href="/register" className="w-100 bg-green-600 text-white px-4 py-2 rounded-md text-center">ЗАРЕЄСТРУВАТИСЬ</Link>
                </div>
    )
}

export default Login