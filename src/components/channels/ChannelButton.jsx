import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {Link} from "react-router-dom";

export default function ChannelButton({channel}) {
    let nyaFile = new NyaFile();

    return (
        <Link to={`/${channel.quark}/${channel._id}`}>
            <StyleProvider nyaFile={nyaFile} asset={"css/channels/channelButton"} />
            <div className={"ChannelButton-container"}>
                <small>#{channel.name}</small>
            </div>
        </Link>
    )
}