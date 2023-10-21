import {NyaFile, StyleProvider} from "@litdevs/nyalib";

export default function Message({messageObject}) {
    let nyaFile = new NyaFile()
    return <div className="Message-container">
        <StyleProvider nyaFile={nyaFile} asset={"css/messages/message"} />
        {messageObject.message.content}
    </div>
}