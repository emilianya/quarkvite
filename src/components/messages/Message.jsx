import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {useMemo} from "react";

export default function Message({messageObject}) {
    let nyaFile = new NyaFile();

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
        <div className="Message-containerWrapper" onClick={() => {console.log(messageObject)}}>
            <div className="Message-endCapLeft">
                <img className="Message-avatar" onError={(e) => {
                    e.target.src = nyaFile.getCachedData("assets/errorAvatar")
                }} src={realAuthor.avatarUri} alt=""/>
            </div>
            <StyleProvider nyaFile={nyaFile} asset={"css/messages/message"} />
            <div className="Message-container">
                <div className="Message-author">
                    {realAuthor.username}{messageObject.author.isBot && <div className="Message-botBadge">{realAuthor.username !== realAuthor.originalName ? realAuthor.originalName : "BOT"}</div>}
                    <small className="Message-small"> {formattedDate}<span className="Message-reallySmall"> via {messageObject.message.ua}</span></small>
                </div>
                <div className="Message-content">
                    {messageObject.message.content}
                    {messageObject.message?.attachments?.length > 0 ? "\n+ Attachments (unsupported)" : ""}
                </div>
            </div>
        </div>
    )
}