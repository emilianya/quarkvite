import ClientContext from "../../context/ClientContext.js";
import {useContext, useEffect, useState} from "react";
import Message from "./Message.jsx";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";

export default function MessageDisplay({channel}) {
    let {messageCache, setMessageCache} = useContext(ClientContext)
    let nyaFile = new NyaFile()

    let [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!messageCache || !messageCache[channel._id]) {
            setMessages([])
            return;
        }
        let channelMessages = messageCache[channel._id];
        let cleanMessageCache = channelMessages.filter((v, i) => channelMessages.findIndex(iv => v.message._id === iv.message._id) === i)
        cleanMessageCache.sort((a, b) => a.message.timestamp - b.message.timestamp)
        let messageArray = cleanMessageCache.map(messageObject => <Message key={messageObject.message._id} messageObject={messageObject} />)
        setMessages(messageArray);
    }, [channel, messageCache]);

    useEffect(() => {
        if (!messageCache[channel._id]) {
            channel.fetchMessages(p => setMessageCache(p)).then()
        }
    }, [channel, messageCache, setMessageCache])

    return <div className={"MessageDisplay-container"}>
        <StyleProvider nyaFile={nyaFile} asset={"css/messages/messageDisplay"} />
        {messages}
    </div>
}