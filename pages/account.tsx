import Head from "next/head";
import Link from "next/link";
import useSubscription from "../hooks/useSubscription";
import useAuth from "../hooks/useAuth";
import {GetStaticProps} from "next";
import {getProducts, Product} from "@stripe/firestore-stripe-payments";
import payments, {goToBillingPortal} from '../lib/stripe'
import {useState} from "react";
import Membership from "../components/Membership";

interface Props {
    plans: Product[]
}

const Account = ({plans}: Props) => {
    const {logout, user, loading} = useAuth()
    const subscription = useSubscription(user)
    const [isBillingLoading, setBillingLoading] = useState(false)

    if (loading) return null

    return (
        <div>
            <Head>
                <title>Account Settings - Netflix</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <header className={`bg-[#141414]`}>
                <Link href={`/`}>
                    <img src={`https://rb.gy/ulxxee`}
                         width={120}
                         height={120}
                         className={`cursor-pointer object-contain`}
                    />
                </Link>
                <Link href={`/account`}>
                    <img src={`https://rb.gy/g1pwyx`}
                         alt={``}
                         className={`cursor-pointer rounded`}
                    />
                </Link>
            </header>

            <main className={`pt-24 mx-auto max-w-6xl px-5 pb-12 transition-all md: p-x-10`}>
                <div className={`flex flex-col gap-x-4`}>
                    <h1 className="text-3xl md:text-4xl">Account</h1>
                    <div className={`-ml-0.5 flex items-center gap-x-1.5`}>
                        <img src={`https://rb.gy/4vfk4r`} alt={``}/>
                        <p className={`text-xs font-semibold text-[#555]`}>Member since {subscription?.created}</p>
                    </div>
                </div>

                <Membership/>

                <div
                    className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
                    <h4 className="text-lg text-[gray]">Plan Details</h4>
                    {/* Find the current plan */}
                    <div className="col-span-2 font-medium">
                        {
                            plans.filter(
                                (plan) => plan.id === subscription?.product
                            )[0]?.name
                        }
                    </div>
                    <p
                        className="cursor-pointer text-blue-500 hover:underline md:text-right"
                        onClick={goToBillingPortal}
                    >
                        Change plan
                    </p>
                </div>

                <div
                    className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
                    <h4 className="text-lg text-[gray]">Settings</h4>
                    <p
                        className="col-span-3 cursor-pointer text-blue-500 hover:underline"
                        onClick={logout}
                    >
                        Sign out of all devices
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Account;

export const getStaticProps: GetStaticProps = async () => {
    const plans = await getProducts(payments, {
        includePrices: true,
        activeOnly: true
    }).then(res => res)
        .catch(error => console.log(error))

    return {
        props: {
            plans
        }
    }
}