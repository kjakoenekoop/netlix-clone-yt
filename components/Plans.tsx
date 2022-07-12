import Head from "next/head";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
import {CheckIcon} from "@heroicons/react/outline";
import {Product} from "@stripe/firestore-stripe-payments";
import Table from "./Table";
import {useState} from "react";
import Loader from "./Loader";
import {loadCheckout} from "../lib/stripe";

interface Props {
    plans: Product[]
}

const Plans = ({plans}: Props) => {
    const {logout, user} = useAuth()
    const [selectedPlan, setSelectedPlan] = useState<Product>(plans[2])
    const [isBillingLoading, setIsBillingLoading] = useState(false)

    const subscribeToPlan = async () => {
        if(!user) return
        loadCheckout(selectedPlan.prices[0].id!)
        setIsBillingLoading(true)
    }

    return (
        <div>
            <Head>
                <title>Netflix</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <header className={`border-b border-white/10 bg-[#141414]`}>
                <Link href={`/`}>
                    <img src={`https://rb.gy/ulxxee`}
                         alt={`Netflix`}
                         width={150}
                         height={90}
                         className={`cursor-pointer object-contain`}
                    />
                </Link>
                <button className={`text-large font-medium hover:underline`}
                        onClick={logout}
                >Sign Out
                </button>
            </header>

            <main className={`mx-auto pt-28 px-5 max-w-5xl pb-12 transition-all md:px-10`}>
                <h1 className={`mb-3 text-3xl font-medium`}>Choose the plan that's right for you</h1>
                <ul>
                    <li className={`flex items-center gap-x-2 text-lg`}>
                        <CheckIcon className={`h-7 w-7 text-[#e50914]`}/>
                        Watch all you want. Ad-free.
                    </li>
                    <li className={`flex items-center gap-x-2 text-lg`}>
                        <CheckIcon className={`h-7 w-7 text-[#e50914]`}/>
                        Recommendations just for you.
                    </li>
                    <li className={`flex items-center gap-x-2 text-lg`}>
                        <CheckIcon className={`h-7 w-7 text-[#e50914]`}/>
                        Change or cancel your plan anytime.
                    </li>
                </ul>

                <div className={`mt-4 flex flex-col space-y-4`}>
                    <div className={`flex w-full items-center justify-end self-end md:w-3/5`}>
                        {plans.map(plan => (
                            <div onClick={() => setSelectedPlan(plan)}
                                 className={`planBox ${selectedPlan?.id === plan.id ? "opacity-100" : "opacity-60"}`}
                                 key={plan.id}>
                                {plan.name}
                            </div>
                        ))}

                    </div>

                    <Table plans={plans} selectedPlan={selectedPlan}/>

                    <button disabled={!selectedPlan || isBillingLoading}
                            className={`mx-auto w-11/12 rounded bg-[#e50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${isBillingLoading && 'opacity-60'}`}
                            onClick={subscribeToPlan}
                    >
                        {isBillingLoading
                            ? (<Loader color={`dark:fill-grey-900`}/>)
                            : 'Subscribe'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Plans;