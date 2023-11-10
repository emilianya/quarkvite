import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useContext, useEffect, useMemo, useState} from "react";
import APIContext from "../context/APIContext.js";
import Spinner from "./Spinner.jsx";
import ClientContext from "../context/ClientContext.js";
import UserInformation from "../util/api/classes/UserInformation.js";
import getUserQuarks from "../util/api/methods/getUserQuarks.js";
import useWebSocket from "react-use-websocket";
import getNetworkInformation from "../util/api/methods/getNetworkInformation.js";
import {Outlet} from "react-router-dom";
import QuarkSelector from "./quarks/QuarkSelector.jsx";
import {useMediaQuery} from "react-responsive";

export default function Client () {
    let [ready, setReady] = useState(false);
    let [spinnerText, setSpinnerText] = useState("Loading client...");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading client...");
    let [gatewayConnected, setGatewayConnected] = useState(false)
    let nyaFile = new NyaFile();
    let {token, networkInformation, setNetworkInformation} = useContext(APIContext);
    let [gatewayUrl, setGatewayUrl] = useState(networkInformation.gateway);

    // ClientContext
    let [userInfo, setUserInfo] = useState(undefined);
    let [quarksInfo, setQuarksInfo] = useState(undefined);
    let [messageCache, setMessageCache] = useState({});
    let [gateway, setGateway] = useState(undefined)
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    let [collapseSidebar, setCollapseSidebar] = useState(isMobile);
    let channelsInfo = useMemo(() => {
        if (!quarksInfo) return [];
        return quarksInfo?.reduce((accumulator, quark) => {
            return [...(accumulator.channels || accumulator), ...quark.channels]
        })
    }, [quarksInfo])
    let {sendJsonMessage} = useWebSocket(gatewayUrl, {
        protocols: token,
        onMessage: (message) => {
            // Call event on the relevant object
            const throwError = (...error) => {
                console.error(error)
                throw new Error(error)
            }
            let eventData
            try {
                eventData = JSON.parse(message.data);
            } catch (e) {
                return throwError("Invalid JSON from gateway?", e)
            }
            let clientState = {
                channelsInfo,
                quarksInfo,
                setQuarksInfo: (p) => setQuarksInfo(p),
                messageCache,
                setMessageCache: (p) => {
                    console.log("Message cache updated")
                    setMessageCache(p)
                } // I am not fully certain I need to be calling the state
            }                                                    // update from in the component but whatever
            switch (eventData.eventId) {
                case "messageCreate":
                case "messageDelete":
                case "messageUpdate": {
                    const eventChannel = channelsInfo.find(c => c._id === eventData.message.channelId);
                    if (!eventChannel) return throwError(`Message event received for unknown channel ${eventData.message.channelId}`, eventData);
                    eventChannel.event(eventData, clientState);
                    break;
                }
                case "channelCreate":
                case "channelDelete":
                case "channelUpdate": {
                    const eventChannel = channelsInfo.find(c => c._id === eventData.channel._id);
                    if (!eventChannel) return throwError(`Channel event received for unknown channel ${eventData.channel._id}`, eventData);
                    eventChannel.event(eventData, clientState);
                    break;
                }
                case "quarkUpdate":
                case "quarkDelete": {
                    const eventQuark = quarksInfo.find(q => q._id === eventData.quark._id)
                    if (!eventQuark) return throwError(`Quark event received for unknown quark ${eventData.quark._id}`, eventData);
                    eventQuark.event(eventData);
                    break;
                }
                case "memberUpdate":
                case "memberLeave":
                case "memberJoin": {
                    // TODO implement something here
                    break;
                }

                case "quarkOrderUpdate":
                case "nicknameUpdate": {
                    // TODO implement something here
                    break;
                }

                case "heartbeat":
                case "subscribe":
                    break;
                default:
                    throwError(`Unhandled event type: ${eventData.eventId}`)
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
    }, !!gatewayUrl && !!quarksInfo)


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

    return <div className="Client-container">
        <StyleProvider nyaFile={nyaFile} asset={"css/client"} />
        <ClientContext.Provider value={{
            userInfo, setUserInfo,
            quarksInfo, setQuarksInfo,
            gateway, setGateway,
            messageCache, setMessageCache,
            gatewayCall: sendJsonMessage,
            channelsInfo,
            collapseSidebar, setCollapseSidebar
        }}>
            {!ready || !gatewayConnected ? <Spinner text={spinnerText} subText={spinnerSubText} /> : <>
                <div className="Client-contentWrapper">
                    <Outlet />
                </div>
                <QuarkSelector />
            </>}
        </ClientContext.Provider>
    </div>
}