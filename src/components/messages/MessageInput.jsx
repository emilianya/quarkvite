import {useState} from "react";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";

export default function MessageInput ({ channel }) {
    let nyaFile = new NyaFile()
    let [message, setMessage] = useState("")

    return <div className={"MessageInput-container"}>
        <StyleProvider nyaFile={nyaFile} asset={"css/messages/messageInput"} />
        <form className={"MessageInput-inputForm"} onSubmit={async (e) => {
            e.preventDefault();
            await channel.sendMessage(message)
        }}>
            <input className={"MessageInput-messageInput"} type={"text"} onInput={(e) => setMessage(e.target.value)} />
            <input className={"MessageInput-messageSubmit"} type={"submit"} />
        </form>
    </div>
}