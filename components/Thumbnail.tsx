import {Movie} from "../types";
import Image from "next/image";
import {BASE_URL} from "../constants/movie";

interface Props {
    movie: Movie
        // | DocumentData (firebase)
}

const Thumbnail = ({movie}: Props) => {
    return (
        <div
            className={"relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-106"}>
            <Image
                src={`${BASE_URL}${movie.backdrop_path || movie.poster_path}`}
                className={"rounded-sm object-cover md:rounded"}
                layout={"fill"}
            />
        </div>
    );
};

export default Thumbnail;