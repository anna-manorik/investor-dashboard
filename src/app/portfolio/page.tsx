'use client';

import Header from "@/components/Header";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { AssetType, PortfolioProps } from "@/types/Props";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const initialValues: PortfolioProps = {
    id: "",
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
    const { user, loading } = useUser();
    const [ portfolio, setPortfolio ] = useState<PortfolioProps[]>()
    const [ stockPrices, setStockPrices ] = useState<StockPriceProps[]>([])
    const { data: session, status } = useSession();
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [currentAsset, setCurentAsset] = useState<PortfolioProps>()
    
        const fetchPortfolio = async () => {
            if (!session?.user?.id) return;
            
           const ref = collection(db, "users", session.user.id, "portfolio");
            const unsubscribe = onSnapshot(ref, (snapshot) => {
                const assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPortfolio(assets as PortfolioProps[]);
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
        
    }, [session?.user?.id]);

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

    if (status === 'loading') {
        return <p className="text-white">Завантаження...</p>;
    }

    if (!session?.user.id) {
        return <p>Ви не авторизовані</p>;
    }

    const handleAddAsset = async (userId: string, values: PortfolioProps, actions: FormikHelpers<PortfolioProps>) => {
        try {
            const portfolioRef = collection(db, "users", userId, "portfolio");
                await addDoc(portfolioRef, {
                    type: values.type,
                    name: values.name,
                    quantity: values.quantity,
                    price: values.price,
                    date: values.date || null,
                    comment: values.comment || "",
                });
            actions.resetForm()
            toast.success("Актив додано!");
        } catch (error) {
            console.error("Помилка при додаванні активу:", error);
        }
    };

     const handleDeleteAsset = async (assetId: string) => {
        if (!session?.user?.id || !assetId) return;

        await deleteDoc(doc(db, "users", session.user.id, "portfolio", assetId));
        toast.success('Your asset was deleted successfully!')
    }

    const handleOpenEditModal = (asset: PortfolioProps) => {
        setCurentAsset(asset)
        setIsModalOpen(true)
    }

    const handleUpdateAsset = async (assetId: string, newData: Partial<PortfolioProps>) => {
        if (!session?.user?.id || !assetId) return;

        await updateDoc(doc(db, "users", session.user.id, "portfolio", assetId), newData);
        setIsModalOpen(false)
        toast.success('Your asset was edited successfully!')
    };

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2 items-center text-black sm:items-start">
        
        <div className="flex items-center flex-col sm:flex-col">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => handleAddAsset(session?.user.id, values, actions)}
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
                        <th className="px-4 py-2 border-b text-left">Редагувати</th>
                        <th className="px-4 py-2 border-b text-left">Видалити</th>
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
                            <td className="px-4 py-2 border-b">{(priceByName.get(asset.name)) ?? asset.price}</td>
                            <td className="px-4 py-2 border-b">{priceByName.get(asset.name) ? (Number(priceByName.get(asset.name)) * asset.quantity).toFixed(0) : asset.price * asset.quantity}</td>
                            <td className="px-4 py-2 border-b">
                            {asset.date
                                ? new Date(asset.date).toLocaleDateString()
                                : "—"}
                            </td>
                            <td className="px-4 py-2 border-b">{asset.comment || "—"}</td>
                            <td className="px-4 py-2 border-b"><button key={asset.id} onClick={() => handleOpenEditModal(asset)}>EDIT</button></td>
                            <td className="px-4 py-2 border-b"><button key={asset.id} onClick={() => asset.id && handleDeleteAsset(asset.id)}>DELETE</button></td>
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


    <div className={isModalOpen && currentAsset?.id ? "fixed inset-0 z-50 flex items-center justify-center" : 'hidden'}>
      {/* затемнений фон */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      ></div>

      {/* контейнер модалки */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-lg p-6">
        <Formik
            initialValues={currentAsset ? currentAsset : initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {currentAsset?.id && handleUpdateAsset(currentAsset?.id, values)}}
            >
            {({ isSubmitting, handleChange }) => (
                <Form className="w-[350px] sm:max-w-[850px] p-6 bg-white shadow-lg rounded-lg space-y-4">
                <h2 className="text-xl font-semibold">Додати актив</h2>

                {/* Тип активу */}
                <div>
                    <label className="block font-medium mb-1">Тип активу</label>
                    <Field
                        as="select"
                        name="type"
                        className="w-full border border-gray-300 p-2 rounded"
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>

                <span className="bg-white p-4">{portfolio?.reduce((acc, asset) => {
                                acc = acc + Number(priceByName.get(asset.name) ? (Number(priceByName.get(asset.name)) * asset.quantity).toFixed(0) : asset.price * asset.quantity)
                                return acc
                            }, 0)}</span>
            </div>
        </div>
      </main>
    </div>
  );
}


