import {NyaFile, NyaSoundClickable, StyleProvider} from "@litdevs/nyalib";
import {useContext, useEffect, useState} from "react";
import APIContext from "../context/APIContext.js";
import getNetworkInformation from "../util/api/methods/getNetworkInformation.js";
import login from "../util/api/methods/login.js";

let animationFrames = [
    { transform: "scale(1, 1)", offset: 0},
    { transform: "scale(1, 1.05)", offset: 0.2},
    { transform: "scale(1, 0.3)", offset: 0.4},
    { transform: "scale(1.05, 0.3)", offset: 0.6},
    { transform: "scale(0, 0)", offset: 1},
];
let animationConfig = {
    duration: 750,
    iterations: 1
};

export default function LoginForm() {
    let nyaFile = new NyaFile();

    let {baseUrl, setToken, setNetworkInformation} = useContext(APIContext)

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [network, setNetwork] = useState(baseUrl);
    let [errorAffects, setErrorAffects] = useState([]);
    let [error, setError] = useState("");
    let [thinking, setThinking] = useState(false);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        setThinking(true)
        setNetworkInformation(null);
        setError("");
        setErrorAffects([])
        if (!email || !password || !network)
        {
            setThinking(false)
            setError("All fields are required")
            setErrorAffects([!email && "email", !password && "password", !network && "network"].filter(e => !!e))
            return;
        }
        let emailRegex = /[^@]+@[^@]+/
        if (!emailRegex.test(email)) {
            setThinking(false)
            setError("Invalid email")
            setErrorAffects(["email"])
            return;
        }
        let networkInfo = await getNetworkInformation(network)
        if (!networkInfo.success) {
            setThinking(false)
            setError(networkInfo.error)
            setErrorAffects(["network"])
            return;
        }
        setNetworkInformation(networkInfo.res)
        let loginInfo = await login(email, password)
        if (!loginInfo.success) {
            setThinking(false)
            switch (loginInfo.error) {
                case "No such user":
                    setErrorAffects(["email"])
                    setError("Wrong email address")
                    break;
                case "Incorrect password/email address combination":
                    setErrorAffects(["password"])
                    setError("Wrong password")
                    break;
                default:
                    setErrorAffects(["email", "password", "network"])
                    setError(loginInfo.error)
            }
            return;
        }
        document.querySelector(".LoginForm-container-wrapper")?.animate(animationFrames, animationConfig);
        document.querySelector(".LoginForm-container")?.animate(animationFrames, animationConfig);
        setTimeout(() => {
            document.querySelector(".LoginForm-container-wrapper").style.display = "none";
            document.querySelector(".LoginForm-container").style.display = "none";
            setThinking(false)
            setToken(loginInfo.res.response.access_token)
        }, 740)
    }

    return <>
        <StyleProvider nyaFile={nyaFile} asset={"css/loginForm"}/>
        <div className="LoginForm-container-wrapper">
            <div className="LoginForm-container">
                <p className="LoginForm-headerText">Login</p>
                <form className="LoginForm-form" onSubmit={formSubmitHandler}>
                    <input className={`LoginForm-emailInput LoginForm-input-box${errorAffects.includes("email") ? " LoginForm-input-box-invalid" : ""}`} placeholder="Email" onInput={(e) => {
                        if (errorAffects.includes("email")) {
                            setErrorAffects(prev => prev.filter(e => e !== "email"))
                        }
                        setEmail(e.target.value)
                    }} type="text" autoComplete="email"/>
                    <input className={`LoginForm-passwordInput LoginForm-input-box${errorAffects.includes("password") ? " LoginForm-input-box-invalid" : ""}`} placeholder="Password" onInput={(e) => {
                        if (errorAffects.includes("password")) {
                            setErrorAffects(prev => prev.filter(e => e !== "password"))
                        }
                        setPassword(e.target.value)
                    }} type="password" autoComplete="current-password"/>
                    <input className={`LoginForm-networkInput LoginForm-input-box${errorAffects.includes("network") ? " LoginForm-input-box-invalid" : ""}`} placeholder="Network url" onInput={(e) => {
                        if (errorAffects.includes("network")) {
                            setErrorAffects(prev => prev.filter(e => e !== "network"))
                        }
                        setNetwork(e.target.value)
                    }} type="text" defaultValue={baseUrl} autoComplete="off"/>
                    <NyaSoundClickable nyaFile={nyaFile} asset="assets/sfx"><div className="LoginForm-submitWrapper"><input className="LoginForm-submit" type="submit" disabled={errorAffects.length > 0} value={thinking ? "..." : "Login"} /></div></NyaSoundClickable>
                </form>
            </div>
        </div>
        <LoginFormError error={errorAffects.length > 0 && error} />
    </>
}

function LoginFormError({error}) {
    let [shouldShow, setShouldShow] = useState(!!error);
    let nyaFile = new NyaFile()

    useEffect(() => {
        if (error) {
            setShouldShow(true);
            return;
        }
        let goAwayTimeout = setTimeout(() => {
            setShouldShow(false)
        }, 740)

        document.querySelector(".LoginFormError-container-wrapper")?.animate(animationFrames, animationConfig);
        document.querySelector(".LoginFormError-container")?.animate(animationFrames, animationConfig);
        return () => {
            clearTimeout(goAwayTimeout)
        }
    }, [error]);

    return shouldShow ? (
        <div className="LoginFormError-container-wrapper">
            <div className="LoginFormError-container">
                <StyleProvider nyaFile={nyaFile} asset={"css/loginFormError"} />
                <p className="LoginFormError-errorHeader">Error!</p>
                <p className="LoginFormError-errorText">{error}</p>
            </div>
        </div>
    ) : <></>
}