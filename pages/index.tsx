import Head from 'next/head'
import Header from "../components/Header";
import Banner from "../components/Banner";
import {Movie} from "../types";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import {useRecoilValue} from "recoil";
import {modalState, movieState} from "../atoms/modalAtom";
import Plans from "../components/Plans";
import {getProducts, Product} from "@stripe/firestore-stripe-payments";
import useSubscription from "../hooks/useSubscription";
import useList from "../hooks/useList";
import Modal from "../components/Modal";
import payments from "../lib/stripe";
import requests from "../utils/requests";

interface Props {
    netflixOriginals: Movie[]
    trendingNow: Movie[]
    topRated: Movie[]
    actionMovies: Movie[]
    comedyMovies: Movie[]
    horrorMovies: Movie[]
    romanceMovies: Movie[]
    documentaries: Movie[]
    plans: Product[]
}

const Home = (
    {
        netflixOriginals,
        trendingNow,
        topRated,
        actionMovies,
        comedyMovies,
        horrorMovies,
        romanceMovies,
        documentaries,
        plans
    }: Props) => {

    const {loading, user} = useAuth()
    const showModal = useRecoilValue(modalState)
    const subscription = useSubscription(user)
    const movie = useRecoilValue(movieState)
    const list = useList(user?.uid)

    if (loading || subscription === null) return null

    if (!subscription) return <Plans plans={plans} />

    return (
        <div className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${showModal && "!h-screen !overflow-hidden"}`}>
            <Head>
                <title>Home - Netflix</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header/>
            <main className={'relative pl-4 pb-24 lg:space-y-24 lg:pl-16'}>
                <Banner netflixOriginals={netflixOriginals}/>
                <section className={"md:space-y-24"}>
                    <Row title={'Trending Now'} movies={trendingNow}/>
                    <Row title={'Top Rated'} movies={topRated}/>
                    <Row title={'Action Thrillers'} movies={actionMovies}/>

                    {list?.length && <Row title={`My List`} movies={list} />}

                    <Row title={'Comedies'} movies={comedyMovies}/>
                    <Row title={'Scary Movies'} movies={horrorMovies}/>
                    <Row title={'Romantic Movies'} movies={romanceMovies}/>
                    <Row title={'Documentaries'} movies={documentaries}/>
                </section>
            </main>
            {modalState && <Modal/>}
        </div>
    )
}

export default Home

export const getServerSideProps = async () => {

    const plans = await getProducts(payments, {
        includePrices: true,
        activeOnly: true
    }).then(res => res)
        .catch(error => console.log(error))

    const [
        netflixOriginals,
        trendingNow,
        topRated,
        actionMovies,
        comedyMovies,
        horrorMovies,
        romanceMovies,
        documentaries,
    ] = await Promise.all([
        fetch(requests.fetchNetflixOriginals).then(res => res.json()),
        fetch(requests.fetchTrending).then(res => res.json()),
        fetch(requests.fetchTopRated).then(res => res.json()),
        fetch(requests.fetchActionMovies).then(res => res.json()),
        fetch(requests.fetchComedyMovies).then(res => res.json()),
        fetch(requests.fetchHorrorMovies).then(res => res.json()),
        fetch(requests.fetchRomanceMovies).then(res => res.json()),
        fetch(requests.fetchDocumentaries).then(res => res.json()),
    ])
    return {
        props: {
            netflixOriginals: netflixOriginals.results,
            trendingNow: trendingNow.results,
            topRated: topRated.results,
            actionMovies: actionMovies.results,
            comedyMovies: comedyMovies.results,
            horrorMovies: horrorMovies.results,
            romanceMovies: romanceMovies.results,
            documentaries: documentaries.results,
            plans
        }
    }
}
