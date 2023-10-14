import React, {useContext, useEffect, useState} from 'react'
import NyaFile from "@litdevs/nyalib";
import AudioContext from "../context/AudioContext.js";
import AssetContext from "../context/AssetContext.js";


function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let {setNyaUrl} = useContext(AssetContext);
    let {setBgm} = useContext(AudioContext);
    let nyaFile = new NyaFile()

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
        setBgm("assets/gate")
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
            <form onSubmit={formSubmitHandler}>
                <input type="email" onInput={(e) => setEmail(e.target.value)} autoComplete="email"/>
                <input type="password" onInput={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                <NyaSoundClickable asset={"assets/sfx"}><input type="submit" style={{backgroundColor: "red"}} onClick={() => {
                    console.log("original click handler")
                }}/></NyaSoundClickable>
            </form>
            <NyaSoundClickable asset={"assets/sfx"}><button onClick={() => {
                console.log("Setting new theme")
                setNyaUrl(password)
            }}>Set nya url to password</button>
            </NyaSoundClickable>
            {/*JSON.stringify(nyaFile.assetCache)*/}
            <img src={nyaFile.getCachedData("assets/spinner")}  alt={""}/>
        {nyaFile.assetCache["assets/spinner"].data.toString()}
        </div>)
}

function NyaSoundClickable({asset, children}) {
    const obtainNewAudio = () => {
        console.log("new sfx requested!")
        return new Promise(resolve => {
            let nyaFile = new NyaFile()
            nyaFile.getAssetDataUrl(asset, true).then(dataUrl => {
                console.log("sfx cached!")
                resolve(new Audio(dataUrl))
            })
        })
    }

    let [sound, setSound] = useState(undefined)

    useEffect(() => {
        setSound(obtainNewAudio())
    }, []);

    const clickHandler = (child) => {
        return async (e) => {
            console.log("playing sfx!");
            (await sound).play();
            setSound(obtainNewAudio())
            child.props.onClick(e)
        }
    }

    return <>
        {React.Children.map(children, child => (
            React.cloneElement(child, {onClick: clickHandler(child)})
        ))}
    </>
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
            console.debug("[AudioProvider] Cleaning up! Likely changing tracks")
            audio.src = null;
        }
    }, [bgm]);

    return (
        <>
        </>
    )
}

export default Quarklight
