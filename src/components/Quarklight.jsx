import {useContext, useEffect, useMemo, useState} from 'react'
import {NyaFile, NyaSoundClickable, StyleProvider} from "@litdevs/nyalib";
import AudioContext from "../context/AudioContext.js";
import AudioProvider from "./nyaUtil/AudioProvider.jsx";
import {Outlet} from "react-router-dom";
import APIConfig from "../util/api/APIConfig.js";
import localForage from "localforage";
import verifyValidToken from "../util/api/methods/verifyValidToken.js";
import networkInformation from "../util/api/methods/networkInformation.js";
import login from "../util/api/methods/login.js";
import APIContext from "../context/APIContext.js";
import Spinner from "./Spinner.jsx";

function Quarklight() {
    let [ready, setReady] = useState(false)
    let [spinnerText, setSpinnerText] = useState("Loading...");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading...");
    let {setBgm} = useContext(AudioContext);
    let nyaFile = new NyaFile();
    let apiConfig = useMemo(() => new APIConfig(), []);
    let [token, setToken] = useState(apiConfig.token)

    useEffect(() => {
        console.debug("Quarklight useEffect");
        // Initialize API related things
        (async () => {
            setSpinnerText("Preparing API")
            setSpinnerSubText("Fetching stored configuration")
            let localConfig = await localForage.getItem("localConfig") || {};
            apiConfig.baseUrl = localConfig?.network?.baseUrl || "https://lightquark.network";
            apiConfig.version = localConfig?.network?.version || "v2";
            apiConfig.token = localConfig?.token || null;
            setToken(apiConfig.token)
            localConfig.network = localConfig?.network || {};
            localConfig.network.baseUrl = apiConfig.baseUrl;
            localConfig.network.version = apiConfig.version;
            localConfig.token = apiConfig.token;
            await localForage.setItem("localConfig", localConfig);
            // If token is present check the validity
            if (apiConfig.token) {
                setSpinnerSubText("Logging in")
                let validToken = await verifyValidToken();
                // If token is not valid clear it
                if (!validToken) {
                    apiConfig.token = null;
                    localConfig.token = apiConfig.token;
                    setToken(apiConfig.token)
                    await localForage.setItem("localConfig", localConfig);
                }
            }
            setSpinnerSubText("Done!")
            // Now if token is present and ready is true we can assume user is logged in
            setReady(true);
        })();
        // setBgm("music/menu")
        // Everything in my brain says this should explode?
        // Somehow it doesn't... even though setBgm is a set state function and apiConfig is a random class
    }, [apiConfig, setBgm]);

    useEffect(() => {
        apiConfig.token = token;
        (async () => {
            let localConfig = await localForage.getItem("localConfig");
            localConfig.token = apiConfig.token;
            await localForage.setItem("localConfig", localConfig);
        })()
    }, [apiConfig, token])

    return (
        <APIContext.Provider value={{
            token, setToken
        }}>
            <div>
                <AudioProvider/>
                <StyleProvider nyaFile={nyaFile} asset="css/quarklight"/>
                {ready ? <>
                    {token ? <Outlet/> : <LoginForm setToken={setToken} />}
                </> : <Spinner text={spinnerText} subText={spinnerSubText} />}
            </div>
        </APIContext.Provider>)
}

function LoginForm({setToken}) {
    let nyaFile = new NyaFile();
    let apiConfig = useMemo(() => new APIConfig(), []);

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [network, setNetwork] = useState(apiConfig.baseUrl);
    let [error, setError] = useState("");

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        setError("");
        // TODO: Network input validation
        // TODO: Email input validation
        // TODO: form fields required
        console.log(email, password, network)
        let networkInfo = await networkInformation(network)
        if (!networkInfo.success) {
            setError(networkInfo.error);
            return;
        }
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
                <input className="LoginForm-networkInput input-box" placeholder="Network url" onInput={(e) => setNetwork(e.target.value)} type="text" defaultValue={apiConfig.baseUrl} autoComplete="off"/>
                <NyaSoundClickable nyaFile={nyaFile} asset="assets/sfx"><input type="submit" value={"Login"} /></NyaSoundClickable>
            </form>
            {error}
        </div>
    </>
}

export default Quarklight
