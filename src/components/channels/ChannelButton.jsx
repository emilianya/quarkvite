import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {Link, useParams} from "react-router-dom";
import {useContext} from "react";
import ClientContext from "../../context/ClientContext.js";
import {useMediaQuery} from "react-responsive";

// import "../../_nyafile/css/channels/channelButton.css"

export default function ChannelButton({channel, quark}) {
    let nyaFile = new NyaFile();

    let {setCollapseSidebar} = useContext(ClientContext);
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    let {channelId} = useParams();

    return (
        <Link to={`/${quark._id}/${channel._id}`} onClick={() => {
            if (isMobile) setCollapseSidebar(true)
        }}>
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