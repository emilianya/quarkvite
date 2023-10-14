import AssetLoader from "./AssetLoader.jsx";
import AssetContext from "../../context/AssetContext.js";
import {useState} from "react";
import AudioContext from "../../context/AudioContext.js";

export default function AssetRoot() {
    let [nyaUrl, setNyaUrl] = useState(undefined)
    let [bgm, setBgm] = useState("");
    return (
        <AssetContext.Provider value={{setNyaUrl, nyaUrl}}>
            <AudioContext.Provider value={{bgm, setBgm}}>
                <AssetLoader />
            </AudioContext.Provider>
        </AssetContext.Provider>
    )
}