import {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {NyaFile, NyaSoundClickable} from "@litdevs/nyalib";
import AudioContext from "../context/AudioContext.js";
import AssetContext from "../context/AssetContext.js";
import AudioProvider from "./nyaUtil/AudioProvider.jsx";

function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [stylesheet, setStylesheet] = useState("assets/quarklight")
    let {setNyaUrl} = useContext(AssetContext);
    let {setBgm} = useContext(AudioContext);
    let nyaFile = new NyaFile()

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
        setBgm("assets/gate")
        setStylesheet("assets/quarklight-alt")
    }

    useEffect(() => {
        console.debug("Quarklight useEffect")
        setBgm("assets/shinzou")
        // Everything in my brain says this should explode?
        // Somehow it doesn't... even though setBgm is a set state function
    }, [setBgm]);

    return (
        <div style={{backgroundImage: `url(${nyaFile.getCachedData("assets/testBackground")})`}}>
            <AudioProvider/>
            <StyleProvider nyaFile={nyaFile} asset={stylesheet}/>
            <form className={"qlform"} onSubmit={formSubmitHandler}>
                <input type="email" onInput={(e) => setEmail(e.target.value)} autoComplete="email"/>
                <input type="password" onInput={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                <NyaSoundClickable nyaFile={nyaFile} asset={"assets/sfx"}><input type="submit" style={{backgroundColor: "red"}} onClick={() => {
                    console.log("original click handler")
                }}/></NyaSoundClickable>
            </form>
            <NyaSoundClickable nyaFile={nyaFile} asset={"assets/sfx"}><button onClick={() => {
                console.log("Setting new theme")
                setNyaUrl(password)
            }}>Set nya url to password</button>
                <p>test</p>
            </NyaSoundClickable>
            <img src={nyaFile.getCachedData("assets/spinner")}  alt={""}/>
        </div>)
}

export default Quarklight

function StyleProvider({asset, nyaFile}) {
    if (!nyaFile) throw new Error("StyleProvider with no nyaFile provided")
    useLayoutEffect(() => {
        let cssTag = document.querySelector(`style[data-nya-css-asset='${asset}']`);
        if (cssTag) {
            cssTag.remove()
        }

        let styleTag = document.createElement('style');
        styleTag.setAttribute("type", "text/css")
        styleTag.setAttribute("data-nya-css-asset", asset)
        styleTag.appendChild(document.createTextNode(nyaFile.getCachedData(asset)))
        document.head.appendChild(styleTag)
        return () => {
            document.querySelector(`style[data-nya-css-asset='${asset}']`).remove();
        }
    }, [asset]);
    return <></>
}
