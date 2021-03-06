import MuiModal from '@mui/material/Modal'
import {useRecoilState} from "recoil";
import {modalState, movieState} from "../atoms/modalAtom";
import {PlusIcon, ThumbUpIcon, VolumeOffIcon, VolumeUpIcon, XIcon} from "@heroicons/react/outline";
import {useEffect, useState} from "react";
import {Genre, Movie} from "../types";
import {collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc} from "@firebase/firestore";
import {Element} from '../types'
import ReactPlayer from "react-player/lazy";
import {FaPlay} from "react-icons/fa";
import {CheckIcon} from "@heroicons/react/solid";
import {db} from "../lib/firebase";
import useAuth from "../hooks/useAuth";
import {toast, Toaster} from "react-hot-toast";

const Modal = () => {
    const [showModal, setShowModal] = useRecoilState(modalState)
    const [movie, setMovie] = useRecoilState<Movie | DocumentData | null>(movieState)
    const [trailer, setTrailer] = useState('')
    const [genres, setGenres] = useState<Genre[]>([])
    const [muted, setMuted] = useState(false)
    const [addedToList, setAddedToList] = useState(false)
    const {user} = useAuth()
    const [movies, setMovies] = useState<DocumentData[] | Movie[]>([])

    useEffect(() => {
        if (!movie) return
        const fetchMovie = async () => {
            const type = movie?.media_type === 'tv' ? 'tv' : 'movie'
            const api = process.env.NEXT_PUBLIC_API_KEY
            const data = await fetch(
                `https://api.themoviedb.org/3/${type}/${movie?.id}?api_key=${api}&language=en-US&append_to_response=videos`
            ).then(response => response.json())

            if (data?.videos) {
                const index = data.videos.results.findIndex((e: Element) => e.type === 'Trailer')
                setTrailer(data.videos.results[index]?.key)
            }
            if (data?.genres) {
                setGenres(data.genres)
            }
        }
        fetchMovie()
    }, [movie])

    useEffect(() => {
        if (!user) return
        return onSnapshot(
            collection(db, 'customers', user.uid, 'myList'),
            snapshot => setMovies(snapshot.docs)
        )
    }, [db, movie?.id])

    useEffect(() => {
        setAddedToList(
            movies.findIndex(result => result.data().id === movie?.id) !== -1
        )
    }, [movies])

    const handleList = async () => {
        if (addedToList) {
            await deleteDoc(
                doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
            )
            toast(`${movie?.title || movie?.original_name} has been removed from My List.`, {
                duration: 8000
            })
        } else {
            await setDoc(
                doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!), {...movie}
            ).catch(e => console.log(e.message))
            toast(`${movie?.title || movie?.original_name} has been added to My List.`, {
                duration: 8000
            })
        }
    }

    const handleClose = () => setShowModal(false)

    return (
        <MuiModal open={showModal}
                  onClose={handleClose}
                  className={`fixed !top-7 left-0 right-0 mx-auto w-full max-w-5xl overflow-y-scroll rounded-md scrollbar-hide`}
        >
            <>
                <Toaster position={`bottom-center`}/>
                <button onClick={handleClose}
                        className={`modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]`}>
                    <XIcon className={`h-6 w-6`}/>
                </button>

                <div className={`relative pt-[56.25%]`}>
                    <ReactPlayer url={`https://www.youtube.com/watch?v=${trailer}`}
                                 width={`100%`}
                                 height={`100%`}
                                 playing
                                 className={`absolute top-0 left-0`}
                                 muted={muted}
                    />
                    <div className={`absolute bottom-10 flex w-full items-center justify-between px-10`}>
                        <div className={`flex space-x-2`}>
                            <button
                                className={`flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]`}>
                                <FaPlay className={`h-7 w-7 text-black`}/>
                                Play
                            </button>

                            <button className={`modalButton`}
                                    onClick={handleList}
                            > {
                                addedToList
                                    ? <CheckIcon className={`h-7 w-7`}/>
                                    : <PlusIcon className={`h-7 w-7`}/>
                            }
                            </button>

                            <button className={`modalButton`}>
                                <ThumbUpIcon className={`h-7 w-7`}/>
                            </button>
                        </div>

                        <button className={`modalButton`}
                                onClick={() => setMuted(!muted)}>
                            {muted
                                ? <VolumeOffIcon className={`h-6 w-6`}/>
                                : <VolumeUpIcon className={`h-6 w-6`}/>
                            }
                        </button>
                    </div>
                </div>

                <div className={`flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8`}>
                    <div className={`space-y-6 text-lg`}>
                        <div className={`flex items-center space-x-2 text-sm`}>
                            <p className={`font-semibold text-green-400`}>{Math.round(movie?.vote_average * 10)}%
                                Match</p>
                            <p className={`font-light`}>{movie?.release_date || movie?.first_air_date}</p>
                            <div
                                className={`flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs`}>HD
                            </div>
                        </div>
                        <div className={`flex flex-col gap-x-10 gap-y-4 font-light md:flex-row`}>
                            <p className={`w-5/6`}>{movie?.overview}</p>
                            <div className={`flex flex-col space-y-3 text-sm`}>
                                <div>
                                    <span className={`text-[grey]`}>Genres: </span>
                                    {genres.map(genre => genre.name).join(', ')}
                                </div>

                                <div>
                                    <span className={`text-[grey]`}>Original language: </span>
                                    {movie?.original_language}
                                </div>

                                <div>
                                    <span className="text-[grey]">Total votes: </span>
                                    {movie?.vote_count}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </MuiModal>
    );
};

export default Modal;