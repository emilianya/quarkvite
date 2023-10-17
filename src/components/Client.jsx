import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import APIContext from "../context/APIContext.js";
import Spinner from "./Spinner.jsx";
import ClientContext from "../context/ClientContext.js";
import UserInformation from "../util/api/classes/UserInformation.js";
import getUserQuarks from "../util/api/methods/getUserQuarks.js";
import useWebSocket from "react-use-websocket";
import getNetworkInformation from "../util/api/methods/getNetworkInformation.js";

export default function Client () {
    let [ready, setReady] = useState(false);
    let [spinnerText, setSpinnerText] = useState("Loading client...");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading client...");
    let [gatewayConnected, setGatewayConnected] = useState(false)
    let nyaFile = new NyaFile();
    let {token, networkInformation, setNetworkInformation} = useContext(APIContext);
    let [gatewayUrl, setGatewayUrl] = useState(networkInformation.gateway);
    let {sendJsonMessage} = useWebSocket(gatewayUrl, {
        protocols: token,
        onMessage: (message) => {
            // TODO: implement something here
            try {
                let messageData = JSON.parse(message.data);
                console.log(messageData)
            } catch (e) {
                console.error("Invalid JSON from gateway?", e)
            }
        },
        onOpen: () => {
            console.info("Gateway connected!")
            quarksInfo.forEach(quark => quark.subscribe(sendJsonMessage));
            setGatewayConnected(true)
        },
        onClose: () => {
            console.info("Gateway disconnected!")
            setGatewayConnected(false)
        },
        onError: (e) => {
            setGatewayConnected(false)
            console.error(e)
        }, // if die tell me
        heartbeat: { // Send heartbeat to gateway every 15 seconds
            message: JSON.stringify({event: "heartbeat", message: "THE MOST BORING HEARTBEAT MESSAGE EVER :("}),
            interval: 15000
        },
    }, !!gatewayUrl)

    // ClientContext
    let [userInfo, setUserInfo] = useState(undefined);
    let [quarksInfo, setQuarksInfo] = useState(undefined);
    let [gateway, setGateway] = useState(undefined)

    useEffect(() => {
        let abortController = new AbortController();
        console.debug("Client useEffect");
        setSpinnerText("Loading client");
            (async () => {
                try {
                    // TODO: Find a better way to do aborting
                    let aborted = false
                    abortController.signal.onabort = () => {
                            aborted = true;
                    }

                    if (!networkInformation) {
                        setSpinnerSubText("Fetching network information")
                        let networkInfo = await getNetworkInformation()
                        if (!networkInfo.success) {
                            // TODO
                            setSpinnerText("Failed to get network info but i dont know what to do now")
                            return;
                        }
                        if (aborted) return;
                        setNetworkInformation(networkInfo.res)
                    }
                    setSpinnerSubText("Fetching user data");
                    let userInformation = new UserInformation();
                    await userInformation.fetch();
                    if (aborted) return;
                    setUserInfo(userInformation);

                    setSpinnerSubText("Fetching quark data");
                    let quarks = await getUserQuarks();
                    if (aborted) return;
                    setQuarksInfo(quarks)

                    setSpinnerSubText("Connecting to gateway");
                    if (aborted) return;
                    setGatewayUrl(networkInformation.gateway);

                    if (aborted) return;
                    setReady(true);
                } catch (e) {
                    console.log(e)
                }
            })()
        return () => {
            abortController.abort("Cleanup");
            setReady(false);
            setGatewayUrl(undefined);
            setQuarksInfo(undefined)
            setUserInfo(undefined);
        }
    }, [networkInformation, setNetworkInformation, token]);

    return <>
        <StyleProvider nyaFile={nyaFile} asset={"css/client"} />
        <ClientContext.Provider value={{
            userInfo, setUserInfo,
            quarksInfo, setQuarksInfo,
            gateway, setGateway,
            gatewayCall: sendJsonMessage
        }}>
            {!ready || !gatewayConnected ? <Spinner text={spinnerText} subText={spinnerSubText} /> : <>
                {JSON.stringify(userInfo)}
                {JSON.stringify(quarksInfo)}
            </>}
        </ClientContext.Provider>
    </>
}