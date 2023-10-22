import {NyaFile, NyaSoundClickable} from "@litdevs/nyalib";
import {useContext, useState} from "react";
import APIContext from "../context/APIContext.js";
import getNetworkInformation from "../util/api/methods/getNetworkInformation.js";
import login from "../util/api/methods/login.js";

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
            setErrorAffects([!email && "email", !password && "password", !network && "network"])
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
        setThinking(false)
        setToken(loginInfo.res.response.access_token)
    }

    return <>
        {/*<StyleProvider nyaFile={nyaFile} asset={"css/loginForm"}/>*/}
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
                    <NyaSoundClickable nyaFile={nyaFile} asset="assets/sfx"><div className="LoginForm-submitWrapper"><input className="LoginForm-submit" type="submit" value={thinking ? "..." : "Login"} /></div></NyaSoundClickable>
                </form>
                {error}
                {JSON.stringify(errorAffects)}
            </div>
        </div>
    </>
}