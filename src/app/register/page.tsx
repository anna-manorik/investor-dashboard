'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AuthUser } from '@/types/Props';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from 'firebase/firestore';

const validationSchema = Yup.object({
    email: Yup.string()
      .email('invalid email')
      .required('*required'),
    password: Yup.string()
      .min(6, 'min 6 symbols')
      .required('*required'),
  });

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)

    const handleSignup = async (values: AuthUser, actions: FormikHelpers<AuthUser>) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: 'user',
                accountType: 'InvestPro',
                createdAt: new Date(),
                portfolio:[],
            });

            console.log('Користувач успішно зареєстрований:', user.email);
            console.log('Дані користувача збережені у Firestore під UID:', user.uid);
            return user;
        } catch (error) {
            console.error('Помилка при реєстрації або записі в Firestore:', error);
        }
    };
    
    return (
            <>
            <h2>ЗАРЕЄСТРУВАТИСЬ</h2>
                <Formik initialValues={{email: '', password: ''}} onSubmit={(values, actions) => {handleSignup(values, actions)}} validationSchema={validationSchema}>
                    <Form className="flex flex-col mb-10 max-w-md mx-auto p-4 bg-white rounded shadow-md text-gray-900">
                        <Field as="input" name="nickname" type="text" placeholder="Nickname" className="h-10 border-4 border-yellow-400" />
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

                        <button type="submit" onClick={() => handleSignup} className="h-10 border-4 border-yellow-400 rounded-xl bg-yellow-300 font-bold">SIGN UP</button>
                    </Form>
                </Formik>
            </>
    )
}

export default Register