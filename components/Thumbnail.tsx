import {Movie} from "../types";
import Image from "next/image";
import {BASE_URL} from "../constants/movie";
import {useRecoilState} from "recoil";
import {modalState, movieState} from "../atoms/modalAtom";
import {DocumentData} from "@firebase/firestore";

interface Props {
    movie: Movie | DocumentData
}

const Thumbnail = ({movie}: Props) => {
    const [showModal, setShowModal] = useRecoilState(modalState)
    const [currentMovie, setCurrentMovie] = useRecoilState(movieState)

    return (
        <div
            className={"relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"}
            onClick={() => {
                setCurrentMovie(movie)
                setShowModal(true)
            }}
        >
            <Image
                src={`${BASE_URL}${movie.backdrop_path || movie.poster_path}`}
                className={"rounded-sm object-cover md:rounded"}
                layout={"fill"}
            />
        </div>
    );
};

export default Thumbnail;

