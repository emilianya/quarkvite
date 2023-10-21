import ClientContext from "../../context/ClientContext.js";
import {useContext, useEffect, useState} from "react";
import Message from "./Message.jsx";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";

export default function MessageDisplay({channel}) {
    let {messageCache} = useContext(ClientContext)
    let nyaFile = new NyaFile()

    let [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("Message display effect")
        if (!messageCache || !messageCache[channel._id]) return;
        let channelMessages = messageCache[channel._id];
        let cleanMessageCache = channelMessages.filter((v, i) => channelMessages.findIndex(iv => v.message._id === iv.message._id) === i)
        let messageArray = cleanMessageCache.map(mo => <Message key={mo.message._id} messageObject={mo} />)
        console.log("Messages", messageArray)
        setMessages(messageArray);
    }, [channel, messageCache]);

    return <div className={"MessageDisplay-container"}>
        <StyleProvider nyaFile={nyaFile} asset={"css/messages/messageDisplay"} />
        {messages}
    </div>
}