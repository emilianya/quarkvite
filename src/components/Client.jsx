import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useContext, useEffect, useState} from "react";
import apiCall from "../util/api/apiCall.js";
import APIContext from "../context/APIContext.js";
import Spinner from "./Spinner.jsx";
import ClientContext from "../context/ClientContext.js";
import UserInformation from "../util/api/classes/UserInformation.js";
import getUserQuarks from "../util/api/methods/getUserQuarks.js";

export default function Client () {
    let [ready, setReady] = useState(false);
    let [spinnerText, setSpinnerText] = useState("Loading client...");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading client...");
    let nyaFile = new NyaFile();
    let {token} = useContext(APIContext);

    // ClientContext
    let [userInfo, setUserInfo] = useState(undefined);
    let [quarksInfo, setQuarksInfo] = useState(undefined);

    useEffect(() => {
        console.debug("Client useEffect");
        setSpinnerText("Loading client");
        (async () => {
            setSpinnerSubText("Fetching user data");
            let userInformation = new UserInformation();
            await userInformation.fetch();
            setUserInfo(userInformation);

            setSpinnerSubText("Fetching quark data");
            let quarks = await getUserQuarks();
            setQuarksInfo(quarks)

            setReady(true);
        })()
    }, [token]);

    return <>
        <StyleProvider nyaFile={nyaFile} asset={"css/client"} />
        <ClientContext.Provider value={{
            userInfo, setUserInfo,
            quarksInfo, setQuarksInfo
        }}>
            {!ready ? <Spinner text={spinnerText} subText={spinnerSubText} /> : <>
                {JSON.stringify(userInfo)}
                {JSON.stringify(quarksInfo)}
            </>}
        </ClientContext.Provider>
    </>
}