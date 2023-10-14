import {useContext, useEffect, useState} from 'react'
import NyaFile from "@litdevs/nyalib";
import AssetContext from "../context/AssetContext.js";
import AudioContext from "../context/AudioContext.js";


function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    //let {setNyaUrl} = useContext(AssetContext);
    let {setBgm} = useContext(AudioContext);
    let nyaFile = new NyaFile()

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
        //setNyaUrl(password)
        setBgm("assets/gate")
    }

    useEffect(() => {
        setBgm("assets/shinzou")
    }, []);

    return (
        <div style={{backgroundImage: `url(${nyaFile.getCachedData("assets/testBackground")})`}}>
            <AudioProvider />
            <form onSubmit={formSubmitHandler}>
                <input type="email" onInput={(e) => setEmail(e.target.value)} autoComplete="email"/>
                <input type="password" onInput={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                <input type="submit"/>
            </form>
            {/*JSON.stringify(nyaFile.assetCache)*/}
            <img src={nyaFile.getCachedData("assets/spinner")}  alt={""}/>
        {nyaFile.assetCache["assets/spinner"].data.toString()}
        </div>)
}

function AudioProvider() {
    let {bgm} = useContext(AudioContext);

    useEffect(() => {
        if (!bgm) return;
        let nyaFile = new NyaFile();
        let audio = new Audio(nyaFile.getCachedData(bgm));
        audio.volume = 0.5
        audio.play();
        return () => {
            audio.src = null;
        }
    }, [bgm]);

    return (
        <>
        </>
    )
}

export default Quarklight
