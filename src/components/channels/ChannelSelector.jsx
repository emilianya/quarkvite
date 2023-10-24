import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import ChannelButton from "./ChannelButton.jsx";
import {createPortal} from "react-dom";
import ClientContext from "../../context/ClientContext.js";

export default function ChannelSelector({ quark }) {
    let nyaFile = new NyaFile()

    let {setCollapseSidebar} = useContext(ClientContext);

    let [channelButtons, setChannelButtons] = useState([]);
    let quarkPortal = document.querySelector("#channelPortal"); // TODO: Investigate if this causes a bunch of issues

    useEffect(() => {
        setChannelButtons(quark.channels.map(channel => {
            return <ChannelButton key={channel._id} channel={channel} />
        }))
    }, [quark])

    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50

    const onTouchStart = (e) => {
        console.log("touch start")
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe || isRightSwipe) console.log('swipe', isLeftSwipe ? 'left' : 'right')
        if (isLeftSwipe) setCollapseSidebar(false)
        if (isRightSwipe) setCollapseSidebar(true)
    }

    return (
        quarkPortal ? <>
            {createPortal(<>
                <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} className={"ChannelSelector-container"}>
                    <StyleProvider nyaFile={nyaFile} asset={"css/channels/channelSelector"} />
                    {channelButtons}
                </div>
            </>, quarkPortal)}
        </> : <></>

    )
}