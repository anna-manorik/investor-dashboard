'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AuthUser } from '@/types/Props';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

const validationSchema = Yup.object({
    login: Yup.string()
      .email('invalid email')
      .required('*required'),
    password: Yup.string()
      .min(6, 'min 6 symbols')
      .required('*required'),
  });

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { data: session } = useSession();

     const handleLogin = (values: AuthUser, actions: FormikHelpers<AuthUser>) => {
            console.log('logged111111')
        };
    
    return (
        <>
        {session ? (
            <div className="flex items-center gap-4">
            <p>Привіт, {session.user?.name}</p>
            <button onClick={() => signOut()} className="text-red-600 hover:underline">Вийти</button>
            </div>
        ) : (
            <button onClick={() => signIn('google')} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Увійти через Google
            </button>
        )}
        <Formik initialValues={{login: '', password: ''}} onSubmit={(values, actions) => {handleLogin(values, actions)}} validationSchema={validationSchema}>
                    <Form className="flex flex-col mb-10 max-w-md mx-auto p-4 bg-white rounded shadow-md text-gray-900">
                        <Field as="input" name="login" type="email" placeholder="Login" className="h-10 border-4 border-yellow-400" />
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

                <Link href="/register" className="flex items-center gap-2 text-xl font-bold text-white-600">ЗАРЕЄСТРУВАТИСЬ</Link>
                </>
    )
}

export default Login