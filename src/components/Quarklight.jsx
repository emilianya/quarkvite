import {useContext, useEffect, useState} from 'react'
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import AudioContext from "../context/AudioContext.js";
import AudioProvider from "./nyaUtil/AudioProvider.jsx";
import {Outlet} from "react-router-dom";
import localForage from "localforage";
import verifyValidToken from "../util/api/methods/verifyValidToken.js";
import APIContext from "../context/APIContext.js";
import Spinner from "./Spinner.jsx";
import AssetContext from "../context/AssetContext.js";
import LoginForm from "./LoginForm.jsx";

function Quarklight() {
    let [ready, setReady] = useState(false)
    let [spinnerText, setSpinnerText] = useState("Loading...");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading...");
    let {setBgm} = useContext(AudioContext);
    let {setNyaUrl} = useContext(AssetContext);
    let nyaFile = new NyaFile();
    let [token, setToken] = useState("");
    let [networkInformation, setNetworkInformation] = useState({});
    let [version, setVersion] = useState("");
    let [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        console.debug("Quarklight useEffect");
        // Initialize API related things
        (async () => {
            setSpinnerText("Preparing API")
            setSpinnerSubText("Fetching stored configuration")
            let localConfig = await localForage.getItem("localConfig") || {};
            let lBaseUrl = localConfig?.network?.baseUrl || localConfig?.networkInformation?.baseUrl || "https://lightquark.network";
            console.log(lBaseUrl, localConfig?.network?.baseUrl, localConfig?.networkInformation?.baseUrl)
            let lVersion = localConfig?.network?.version || "v2";
            let lToken = localConfig?.token || null;
            let lNetwork = localConfig?.network || {};
            let lNetworkInformation = localConfig?.networkInformation || {};
            setBaseUrl(lBaseUrl);
            setVersion(lVersion);
            setNetworkInformation(lNetworkInformation);
            setToken(lToken);
            localConfig.network = lNetwork;
            localConfig.network.baseUrl = lBaseUrl;
            localConfig.network.version = lVersion;
            localConfig.networkInformation = lNetworkInformation;
            localConfig.token = lToken;
            await localForage.setItem("localConfig", localConfig);
            // If token is present check the validity
            if (lToken) {
                setSpinnerSubText("Logging in")
                let validToken = await verifyValidToken();
                // If token is not valid clear it
                if (!validToken) {
                    localConfig.token = null;
                    setToken(null)
                    await localForage.setItem("localConfig", localConfig);
                }
            }
            setSpinnerSubText("Done!")
            // Now if token is present and ready is true we can assume user is logged in
            setReady(true);
        })();
        // setBgm("music/menu")
        // Everything in my brain says this should explode?
        // Somehow it doesn't... even though setBgm is a set state function
    }, [setBgm]);

    return (
        <APIContext.Provider value={{
            token, setToken,
            networkInformation, setNetworkInformation,
            version, setVersion,
            baseUrl, setBaseUrl
        }}>
            <style type="text/css">
                {`@font-face{
                    font-family: Main;
                    src: url(${nyaFile.getCachedData("fonts/main")});
                }`}
                {`@font-face{
                    font-family: Main-Bold;
                    src: url(${nyaFile.getCachedData("fonts/bold")});
                }`}

            </style>
            <div className={"Quarklight-container"} style={{backgroundImage: `url(${nyaFile.getCachedData("assets/bg-tileable")})`}}>
                <AudioProvider/>
                <StyleProvider nyaFile={nyaFile} asset="css/quarklight"/>
                {ready ? <>
                    {token ?
                        <Outlet/> : <LoginForm />}
                </> : <Spinner text={spinnerText} subText={spinnerSubText} />}
                <div className={"bullshitContainer"}>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        setNyaUrl(e.target.elements[0].value || undefined)
                    }}>
                        <input type={"text"} placeholder={"Custom nyafile url"} />
                        <input type={"submit"} />
                    </form>
                    <button onClick={() => {
                        setToken(null);
                        (async () => {
                            let localConfig = await localForage.getItem("localConfig");
                            localConfig.token = null;
                            await localForage.setItem("localConfig", localConfig)
                        })();
                    }}>Log out</button>
                </div>
            </div>
        </APIContext.Provider>)
}

export default Quarklight
