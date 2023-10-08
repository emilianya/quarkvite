import AssetLoader from "./AssetLoader.jsx";
import AssetContext from "../../context/AssetContext.js";
import {useState} from "react";

export default function AssetRoot() {
    let [nyaUrl, setNyaUrl] = useState(undefined)
    return <AssetContext.Provider value={{setNyaUrl, nyaUrl}}>
        <AssetLoader />
    </AssetContext.Provider>
}