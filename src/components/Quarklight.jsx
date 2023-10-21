import {useContext, useEffect, useState} from 'react'
import {NyaFile, NyaSoundClickable, StyleProvider} from "@litdevs/nyalib";
import AudioContext from "../context/AudioContext.js";
import AudioProvider from "./nyaUtil/AudioProvider.jsx";
import {Outlet} from "react-router-dom";
import localForage from "localforage";
import verifyValidToken from "../util/api/methods/verifyValidToken.js";
import getNetworkInformation from "../util/api/methods/getNetworkInformation.js";
import login from "../util/api/methods/login.js";
import APIContext from "../context/APIContext.js";
import Spinner from "./Spinner.jsx";

function Quarklight() {
    let [ready, setReady] = useState(false)
    let [spinnerText, setSpinnerText] = useState("Loading...");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading...");
    let {setBgm} = useContext(AudioContext);
    let nyaFile = new NyaFile();
    let [token, setToken] = useState("");
    let [networkInformation, setNetworkInformation] = useState("");
    let [version, setVersion] = useState("");
    let [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        console.debug("Quarklight useEffect");
        // Initialize API related things
        (async () => {
            setSpinnerText("Preparing API")
            setSpinnerSubText("Fetching stored configuration")
            let localConfig = await localForage.getItem("localConfig") || {};
            let lBaseUrl = localConfig?.network?.baseUrl || "https://lightquark.network";
            let lVersion = localConfig?.network?.version || "v2";
            let lToken = localConfig?.token || null;
            let lNetwork = localConfig?.network || {};
            let lNetworkInformation = localConfig?.networkInformation || {};
            setBaseUrl(lBaseUrl);
            setVersion(lVersion);
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
            <div className={"Quarklight-container"}>
                <AudioProvider/>
                <StyleProvider nyaFile={nyaFile} asset="css/quarklight"/>
                {ready ? <>
                    {token ? <Outlet/> : <LoginForm />}
                </> : <Spinner text={spinnerText} subText={spinnerSubText} />}
            </div>
        </APIContext.Provider>)
}

function LoginForm() {
    let nyaFile = new NyaFile();

    let {baseUrl, setToken, setNetworkInformation} = useContext(APIContext)

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [network, setNetwork] = useState(baseUrl);
    let [errorAffects, setErrorAffects] = useState([]);
    let [error, setError] = useState("");

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        setError("");
        setErrorAffects([])
        if (!email || !password || !network)
        {
            setError("All fields are required")
            setErrorAffects([!email && "email", !password && "password", !network && "network"])
            return;
        }
        let emailRegex = /[^@]+@[^@]+/
        if (!emailRegex.test(email)) {
            setError("Invalid email")
            setErrorAffects(["email"])
            return;
        }
        let networkInfo = await getNetworkInformation(network)
        if (!networkInfo.success) {
            setError(networkInfo.error)
            setErrorAffects(["network"])
            return;
        }
        setNetworkInformation(networkInfo.res)
        let loginInfo = await login(email, password)
        console.log(loginInfo)
        if (!loginInfo.success) {
            setError(loginInfo.error);
            return;
        }
        setToken(loginInfo.res.response.access_token)
    }

    return <>
        <StyleProvider nyaFile={nyaFile} asset={"css/loginForm"}/>
        <div className="LoginForm-container">
            <form className="LoginForm-form" onSubmit={formSubmitHandler}>
                <input className="LoginForm-emailInput input-box" placeholder="Email" onInput={(e) => setEmail(e.target.value)} type="text" autoComplete="email"/>
                <input className="LoginForm-passwordInput input-box" placeholder="Password" onInput={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password"/>
                <input className="LoginForm-networkInput input-box" placeholder="Network url" onInput={(e) => setNetwork(e.target.value)} type="text" defaultValue={baseUrl} autoComplete="off"/>
                <NyaSoundClickable nyaFile={nyaFile} asset="assets/sfx"><input type="submit" value={"Login"} /></NyaSoundClickable>
            </form>
            {error}
            {JSON.stringify(errorAffects)}
        </div>
    </>
}

export default Quarklight
