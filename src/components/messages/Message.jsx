import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useContext, useMemo, useState} from "react";
import deleteMessage from "../../util/api/methods/deleteMessage.js";
import ClientContext from "../../context/ClientContext.js";

export default function Message({messageObject}) {
    let nyaFile = new NyaFile();
    let [showTools, setShowTools] = useState(false);
    let {setMessageCache} = useContext(ClientContext);

    let realAuthor = useMemo(() => {
        let botMessage = messageObject.message.specialAttributes.find(a => a.type === "botMessage")
        messageObject.author.originalName = messageObject.author.username;
        if (!botMessage) return messageObject.author;
        let author = structuredClone(messageObject.author);
        author.avatarUri = botMessage.avatarUri;
        author.originalName = messageObject.author.username;
        author.username = botMessage.username;
        return author;
    }, [messageObject])

    function formatDate(date) {
        // If today
        if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
            return `Today at ${date.toLocaleTimeString(navigator.language, {hour: "2-digit", minute: "2-digit"})}`;
        }

        return date.toLocaleDateString();
    }
    let formattedDate = useMemo(() => formatDate(new Date(messageObject.message.timestamp)), [messageObject])

    return (
        <div className="Message-containerWrapper" onClick={() => {console.log(messageObject)}} onTouchEnd={() => {
            setShowTools(p => !p)
        }} onMouseEnter={() => {
            setShowTools(true)
        }} onMouseLeave={() => {
            setShowTools(false)
        }}>
            <div className="Message-endCapLeft">
                <img className="Message-avatar" onError={(e) => {
                    e.target.src = nyaFile.getCachedData("assets/errorAvatar")
                }} src={realAuthor.avatarUri} alt=""/>
            </div>
            <StyleProvider nyaFile={nyaFile} asset={"css/messages/message"} />
            <div className="Message-container">
                <div className="Message-main">
                    <div className="Message-author">
                        {realAuthor.username}{messageObject.author.isBot && <div className="Message-botBadge">{realAuthor.username !== realAuthor.originalName ? realAuthor.originalName : "BOT"}</div>}
                        <small className="Message-small"> {formattedDate}<span className="Message-reallySmall"> via {messageObject.message.ua}</span></small>
                    </div>
                    <div className="Message-content">
                        {messageObject.message.content}
                        {messageObject.message?.attachments?.map((attachment, index) => <><br /> <a target="_blank" href={attachment}>Attachment {index}</a></>)}
                    </div>
                </div>
                <div className="Message-tools" hidden={!showTools}>
                    <div className="Message-toolsDelete" onClick={async () => {
                        let deleteRes = await deleteMessage(messageObject.message.channelId, messageObject.message._id)
                        if (!deleteRes.success) {
                            alert(deleteRes.reason) // this is not a handler but better than nothing
                            // TODO: Handler here :D
                        }
                    }}>
                        Delete
                    </div>
                    <div className="Message-toolsEdit">
                        Edit
                    </div>
                    <div className="Message-toolsReply">
                        Reply
                    </div>
                </div>
            </div>
        </div>
    )
}