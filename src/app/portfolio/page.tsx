'use client';

import Header from "@/components/Header";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { AssetType, PortfolioProps } from "@/types/Props";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const initialValues: PortfolioProps = {
                type: "" as AssetType,
                name: "",
                quantity: 0,
                price: 0,
                date: new Date,
                comment: "",
}

const validationSchema = Yup.object({
                type: Yup.string().required("Виберіть тип активу"),
                name: Yup.string().required("Вкажіть назву або тікер"),
                quantity: Yup.number()
                .positive("Має бути більше 0")
                .required("Вкажіть кількість"),
                price: Yup.number()
                .positive("Має бути більше 0")
                .required("Вкажіть ціну купівлі"),
                date: Yup.date().nullable(),
                comment: Yup.string().max(200, "Максимум 200 символів"),
            })

            type StockPriceProps = {
                name: string,
                price: number | string,
            }

export default function Portfolio() {
    const { user } = useUser();
    const [portfolio, setPortfolio] = useState<PortfolioProps[]>()
    const [stockPrices, setStockPrices] = useState<StockPriceProps[]>([])

    // if (!user) return <p className="text-orange-900">Loading...</p>
    
        const fetchPortfolio = async () => {
            if (!user?.uid) return;

            const userRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPortfolio(data.portfolio || []);
                } else {
                    setPortfolio([]);
                }
            });

            return () => unsubscribe();
        };

        const fetchStockTickerPrice = async (ticker: string) => {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=d2erlk1r01qlu2r0guj0d2erlk1r01qlu2r0gujg`)
                const data = await response.json()
                const price = data.c;

                setStockPrices((prev) => ([
                    ...prev,
                    {name: ticker,
                    price,}
                ]));
            } catch (error) {
                console.log('error', error)
            } finally {

            }
        }

        const getStockPrices = (portfolio: PortfolioProps[]) => {
            for (const asset of portfolio) {
                if (asset.type.toString() === 'stock') {
                    fetchStockTickerPrice(asset.name)
                } else {
                    setStockPrices((prev) => ([
                        ...prev,
                        {name: asset.name,
                            price: '-',}
                    ]));
                }
            }
        }


  
    useEffect(() => {
        fetchPortfolio();
    }, [user?.uid]);

    useEffect(() => {
        if (portfolio && portfolio?.length > 0) {
            getStockPrices(portfolio);
        }
    }, [portfolio]);

    useEffect(() => {
    }, [stockPrices]);

    const priceByName = useMemo(
        () => new Map(stockPrices.map(p => [p.name, typeof p.price === "number" && p.price.toFixed(2)])),
        [stockPrices]
    );

    const handleAddAsset = async (values: PortfolioProps, actions: FormikHelpers<PortfolioProps>) => {
            if (!user?.uid) {
                throw new Error("UID користувача не знайдено. Можливо, він не авторизований.");
            }
            
            try{
                await updateDoc(doc(db, "users", user.uid), {
                    portfolio: arrayUnion({
                    type: values.type,
                    name: values.name,
                    quantity: values.quantity,
                    price: values.price,
                    date: values.date || null,
                    comment: values.comment || ""
                })
            });
            actions.resetForm();
            toast.success("Ви успішно додали новий актив!");
        } catch (error) {
            console.error("Помилка оновлення статусу повідомлення:", error);
            toast.error("Не вдалося оновити статус повідомлення.");
        }
    }

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center text-black sm:items-start">
        
        <div className="flex items-center flex-col sm:flex-col">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAddAsset}
            >
            {({ isSubmitting }) => (
                <Form className="w-[350px] sm:max-w-[850px] p-6 bg-white shadow-lg rounded-lg space-y-4">
                <h2 className="text-xl font-semibold">Додати актив</h2>

                {/* Тип активу */}
                <div>
                    <label className="block font-medium mb-1">Тип активу</label>
                    <Field
                    as="select"
                    name="type"
                    className="w-full border border-gray-300 p-2 rounded"
                    >
                    <option value="">Оберіть...</option>
                    <option value="stock">Акція</option>
                    <option value="crypto">Криптовалюта</option>
                    <option value="deposit">Банківський депозит</option>
                    <option value="real_estate">Нерухомість</option>
                    <option value="land">Земля</option>
                    <option value="other">Інше</option>
                    </Field>
                    <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm"
                    />
                </div>

                {/* Назва або тікер */}
                <div>
                    <label className="block font-medium mb-1">Назва або тікер</label>
                    <Field
                    type="text"
                    name="name"
                    placeholder="Наприклад: AAPL, BTC, ETH"
                    className="w-full border border-gray-300 p-2 rounded"
                    />
                    <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                    />
                </div>

                {/* Кількість одиниць */}
                <div>
                    <label className="block font-medium mb-1">Кількість одиниць</label>
                    <Field
                    type="number"
                    name="quantity"
                    placeholder="Наприклад: 10 або 0.5"
                    className="w-full border border-gray-300 p-2 rounded"
                    />
                    <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-sm"
                    />
                </div>

                {/* Ціна купівлі */}
                <div>
                    <label className="block font-medium mb-1">Ціна купівлі (за одиницю)</label>
                    <Field
                    type="number"
                    name="price"
                    placeholder="USD, EUR або ін."
                    className="w-full border border-gray-300 p-2 rounded"
                    />
                    <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-sm"
                    />
                </div>

                {/* Дата купівлі */}
                <div>
                    <label className="block font-medium mb-1">Дата купівлі (опційно)</label>
                    <Field
                    type="date"
                    name="date"
                    className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>

                {/* Коментар */}
                <div>
                    <label className="block font-medium mb-1">Коментар або позначка</label>
                    <Field
                    as="textarea"
                    name="comment"
                    placeholder="Наприклад: довгострокова, для перепродажу"
                    className="w-full border border-gray-300 p-2 rounded h-20"
                    />
                    <ErrorMessage
                    name="comment"
                    component="div"
                    className="text-red-500 text-sm"
                    />
                </div>

                {/* Кнопка */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Зберегти
                </button>
                </Form>
            )}
            </Formik>

            <div className="overflow-x-auto mt-10">
                <table className="min-w-full border border-gray-200 bg-white shadow-sm rounded-lg">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Тип активу</th>
                        <th className="px-4 py-2 border-b text-left">Назва / Тікер</th>
                        <th className="px-4 py-2 border-b text-left">Кількість</th>
                        <th className="px-4 py-2 border-b text-left">Ціна за одиницю</th>
                        <th className="px-4 py-2 border-b text-left">Поточна ціна</th>
                        <th className="px-4 py-2 border-b text-left">Загальна вартість</th>
                        <th className="px-4 py-2 border-b text-left">Дата купівлі</th>
                        <th className="px-4 py-2 border-b text-left">Коментар</th>
                    </tr>
                    </thead>
                    <tbody>
                    {portfolio && portfolio?.length > 0 ? (
                        portfolio.map((asset, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{asset.type}</td>
                            <td className="px-4 py-2 border-b">{asset.name}</td>
                            <td className="px-4 py-2 border-b">{asset.quantity}</td>
                            <td className="px-4 py-2 border-b">{asset.price}</td>
                            <td className="px-4 py-2 border-b">{(priceByName.get(asset.name)) ?? "—"}</td>
                            <td className="px-4 py-2 border-b">{priceByName.get(asset.name) !== '-' ? (Number(priceByName.get(asset.name)) * asset.quantity).toFixed(0) : '-'}</td>
                            <td className="px-4 py-2 border-b">
                            {asset.date
                                ? new Date(asset.date).toLocaleDateString()
                                : "—"}
                            </td>
                            <td className="px-4 py-2 border-b">{asset.comment || "—"}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td
                            colSpan={6}
                            className="px-4 py-4 text-center text-gray-500"
                        >
                            Активів немає
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <span className="bg-white">{portfolio?.reduce((acc, asset) => {
                                acc = acc + (asset.price * asset.quantity) 
                                return acc
                            }, 0)}</span>
            </div>
        </div>
      </main>
    </div>
  );
}
function useAuth(): { user: any; } {
    throw new Error("Function not implemented.");
}

