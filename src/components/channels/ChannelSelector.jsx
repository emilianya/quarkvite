import {useEffect, useState} from "react";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import ChannelButton from "./ChannelButton.jsx";

export default function ChannelSelector({ quark }) {
    let nyaFile = new NyaFile()

    let [channelButtons, setChannelButtons] = useState([]);

    useEffect(() => {
        setChannelButtons(quark.channels.map(channel => {
            return <ChannelButton key={channel._id} channel={channel} />
        }))
    }, [quark])

    return (
        <div className={"ChannelSelector-container"}>
            <StyleProvider nyaFile={nyaFile} asset={"css/channels/channelSelector"} />
            {channelButtons}
        </div>
    )
}