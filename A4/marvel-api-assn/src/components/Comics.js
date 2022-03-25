import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";

const Comics = () => {
    const [loading, setLoading] = useState(true);
    // const [searchTerm, setSearchTerm] = useState(undefined);
    const [comicData, setComicData] = useState(undefined);
    // const [searchData, setSearchData] = useState(undefined);
    const [comOffset, setComOffset] = useState(0);
    const [comLimit] = useState(20);
    const [comTotal, setComTotal] = useState(0);
    let comCard = null;
    let {page} = useParams();
    useEffect(() => {
        async function fetchComics() {
            let url = null;
            try {
                url = targetUrl(comOffset);
                let {data} = await axios.get(url);
                setLoading(false);
                setComOffset(comLimit*(parseInt(page)));
                let comData = data.data, code = data.code;
                let {results, total} = comData;
                setComTotal(total);
                if(code === 404) {
                    return null;
                } else {
                    setComicData(results);
                }
            } catch (e) {
                console.log(e);
            }

        }
        fetchComics();
    }, [comLimit, comOffset, page])

    if(comicData) {
        comCard = comicData.map((comic) => {
            return buildCard(comic);
        })
    }
    if (loading) {
        return (
            <div>
                <p>loading...</p>
            </div>
        )
    } else {
        return (
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {comCard}
                <Pagination 
                    charactersPerPage={comLimit}
                    characterOffset = {comOffset}
                    totalCharacters={comTotal}
                    currentPage={parseInt(page)}
                />
            </div>
        )
    }
}



const targetUrl = (comicOffset) => {
    const md5 = require('blueimp-md5');
    const baseURL = process.env.REACT_APP_BASE_URL;
    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    let timestamp = new Date().getTime();
    const stringToHash = timestamp + privateKey + publicKey;
    const hash = md5(stringToHash);
    if(comicOffset === 0) {
        return baseURL+`/v1/public/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
    } else {
        return baseURL+`/v1/public/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&offset=${comicOffset}`;
    }
}

const buildCard = (comic) => {
    console.log('Cards built');
    return(
        <div key={comic.id}>
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                    alt={comic.name}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <p>{comic.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Comics