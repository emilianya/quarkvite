import {useContext, useEffect} from "react";
import AudioContext from "../../context/AudioContext.js";
import NyaFile from "@litdevs/nyalib";

export default function AudioProvider() {
    let {bgm} = useContext(AudioContext);

    useEffect(() => {
        if (!bgm) return;
        let nyaFile = new NyaFile();
        let audio = new Audio(nyaFile.getCachedData(bgm));
        audio.volume = 0.5
        audio.play();
        return () => {
            console.debug("[AudioProvider] Cleaning up! Likely changing tracks")
            audio.src = null;
        }
    }, [bgm]);

    return (
        <>
        </>
    )
}