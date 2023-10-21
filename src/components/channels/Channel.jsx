import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useParams} from "react-router-dom";
import {useContext, useMemo} from "react";
import ClientContext from "../../context/ClientContext.js";

export default function Channel() {
    let { channelId } = useParams();
    let nyaFile = new NyaFile();
    let {channelsInfo} = useContext(ClientContext);

    let channel = useMemo(() => channelsInfo.find(channel => channel._id === channelId), [channelId, channelsInfo])

    return (
        channel ? <>
            <StyleProvider nyaFile={nyaFile} asset={"css/channels/channel"} />
            Current channel is: {channel.name} ({channel._id})

        </> : <>Couldn't load channel {JSON.stringify(channelsInfo)}</>
    )
}