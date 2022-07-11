import Image from "next/image";
import {Movie} from "../types";
import {useEffect, useState} from "react";
import {BASE_URL} from "../constants/movie";
import {InformationCircleIcon} from "@heroicons/react/solid";
import {FaPlay} from "react-icons/fa";

interface Props {
    netflixOriginals: Movie[]
}

const Banner = ({netflixOriginals}: Props) => {
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * netflixOriginals.length)
        setMovie(netflixOriginals[randomNumber])
    }, [])

    return (
        <div className={"flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12"}>
            <div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
                <Image
                    src={`${BASE_URL}${movie?.backdrop_path || movie?.poster_path}`}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <h1 className="font-bold text-2xl md:text-4xl lg:text-7xl">
                {movie?.title || movie?.name || movie?.original_name}
            </h1>
            <p className="max-w-xs text-shadow-md text-xs md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
                {movie?.overview}
            </p>
            <div className={'flex space-x-3'}>
                <button className={'bannerButton bg-white text-black'}><FaPlay
                    className={'h-4 w-4 text-black md:h-7 md:w-7'}/> Play
                </button>
                <button className={'bannerButton bg-[grey]/70'}>More Info<InformationCircleIcon
                    className={'h-5 w-5 md:h-8 md:w-8'}/></button>
            </div>
        </div>
    )
}

export default Banner