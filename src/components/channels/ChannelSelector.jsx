import {useEffect, useMemo, useState} from "react";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import ChannelButton from "./ChannelButton.jsx";
import {createPortal} from "react-dom";

export default function ChannelSelector({ quark }) {
    let nyaFile = new NyaFile()

    let [channelButtons, setChannelButtons] = useState([]);
    let quarkPortal = document.querySelector("#channelPortal");
    console.log("Quark Portal", quarkPortal)

    useEffect(() => {
        setChannelButtons(quark.channels.map(channel => {
            return <ChannelButton key={channel._id} channel={channel} />
        }))
    }, [quark])

    return (
        quarkPortal ? <>
            {createPortal(<>
                <div className={"ChannelSelector-container"}>
                    <StyleProvider nyaFile={nyaFile} asset={"css/channels/channelSelector"} />
                    {channelButtons}
                </div>
            </>, quarkPortal)}
        </> : <></>

    )
}