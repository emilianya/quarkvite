import {useContext, useEffect, useState} from 'react'
import {NyaFile, NyaSoundClickable, StyleProvider} from "@litdevs/nyalib";
import AudioContext from "../context/AudioContext.js";
//import AssetContext from "../context/AssetContext.js";
import AudioProvider from "./nyaUtil/AudioProvider.jsx";

function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    //let {setNyaUrl} = useContext(AssetContext);
    let {setBgm} = useContext(AudioContext);
    let nyaFile = new NyaFile()

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
    }

    useEffect(() => {
        console.debug("Quarklight useEffect")
        // setBgm("music/menu")
        // Everything in my brain says this should explode?
        // Somehow it doesn't... even though setBgm is a set state function
    }, [setBgm]);

    return (
        <div /*style={{backgroundImage: `url(${nyaFile.getCachedData("assets/testBackground")})`}}*/>
            <AudioProvider/>
            <StyleProvider nyaFile={nyaFile} asset="css/quarklight"/>
            <form className="login-form" onSubmit={formSubmitHandler}>
                <input type="email" onInput={(e) => setEmail(e.target.value)} autoComplete="email"/>
                <input type="password" onInput={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                <NyaSoundClickable nyaFile={nyaFile} asset={"assets/sfx"}>
                    <input type="submit"/>
                </NyaSoundClickable>
            </form>
        </div>)
}

export default Quarklight
