import {useEffect, useState} from "react";
import {onCurrentUserSubscriptionUpdate, Subscription} from "@stripe/firestore-stripe-payments";
import firebase from "firebase/compat";
import payments from "../lib/stripe";
import {User} from "@firebase/auth";

const useSubscription = (user: User | null) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null)

    useEffect(() => {
        if (!user) return
        onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
            setSubscription(snapshot.subscriptions.filter((subscription) =>
                ['active', 'trialing'].includes(subscription.status)
            )[0])
        })
    }, [user])

    return subscription
};

export default useSubscription;