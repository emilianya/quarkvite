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
        console.log("M", messageCache, channelMessages)
        let cleanMessageCache = channelMessages.filter((v, i) => channelMessages.findIndex(iv => v._id === iv._id) === i)
        cleanMessageCache.sort((a, b) => a.timestamp - b.timestamp)
        let messageArray = cleanMessageCache.map(messageObject => <Message key={messageObject.message?._id} channel={channel} messageObject={messageObject} />)
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