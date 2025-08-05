'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AuthUser } from '@/types/Props';
import Link from 'next/link';

const validationSchema = Yup.object({
    login: Yup.string()
      .email('invalid email')
      .required('*required'),
    password: Yup.string()
      .min(6, 'min 6 symbols')
      .required('*required'),
  });

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)

     const handleSignup = (values: AuthUser, actions: FormikHelpers<AuthUser>) => {
            console.log('handleSignup!!!!!!!!!')
        };
    
    return (
            <>
                <Formik initialValues={{login: '', password: ''}} onSubmit={(values, actions) => {handleSignup(values, actions)}} validationSchema={validationSchema}>
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

                        <button type="submit" onClick={() => handleSignup} className="h-10 border-4 border-yellow-400 rounded-xl bg-yellow-300 font-bold">SIGN UP</button>
                    </Form>
                </Formik>
                <Link href="/register" className="flex items-center gap-2 text-xl font-bold text-white-600">ЗАРЕЄСТРУВАТИСЬ</Link>
            </>
    )
}

export default Register