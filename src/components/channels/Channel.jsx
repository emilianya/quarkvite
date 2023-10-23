import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useParams} from "react-router-dom";
import {useContext, useMemo} from "react";
import ClientContext from "../../context/ClientContext.js";
import MessageDisplay from "../messages/MessageDisplay.jsx";
import MessageInput from "../messages/MessageInput.jsx";

export default function Channel() {
    let { channelId } = useParams();
    let nyaFile = new NyaFile();
    let {channelsInfo} = useContext(ClientContext);

    let channel = useMemo(() => channelsInfo.find(channel => channel._id === channelId), [channelId, channelsInfo])

    return (
        channel ? <>
            <StyleProvider nyaFile={nyaFile} asset={"css/channels/channel"} />
            Current channel is: {channel.name} ({channel._id})
            {/*<MessageDisplay channel={channel} />*/}
            <MessageInput channel={channel} />
        </> : <>Could not load channel {JSON.stringify(channelsInfo)}</>
    )
}