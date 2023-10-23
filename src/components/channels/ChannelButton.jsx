import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {Link, useParams} from "react-router-dom";

// import "../../_nyafile/css/channels/channelButton.css"

export default function ChannelButton({channel}) {
    let nyaFile = new NyaFile();

    let {channelId} = useParams();

    return (
        <Link to={`/${channel.quark}/${channel._id}`}>
            <StyleProvider nyaFile={nyaFile} asset={"css/channels/channelButton"} />
            <div className={`ChannelButton-container${channelId === channel._id ? " ChannelButton-selectedContainer" : ""}`}>
                <div className={`ChannelButton-endCapLeft${channelId === channel._id ? " ChannelButton-selectedEndCapLeft" : ""}`} />
                <div className={`ChannelButton-innerContainer${channelId === channel._id ? " ChannelButton-selectedInnerContainer" : ""}`}>
                    {/*TODO: Muted channels*/}
                    {/*TODO: Unread channels*/}
                    <p className="ChannelButton-nameText">{channel.name}</p>
                </div>
                {/*<div className={`ChannelButton-endCapRight${channelId === channel._id ? " ChannelButton-selectedEndCapRight" : ""}`} />*/}
            </div>
        </Link>
    )
}