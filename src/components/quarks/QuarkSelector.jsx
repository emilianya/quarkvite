import {useContext, useEffect, useRef, useState} from "react";
import ClientContext from "../../context/ClientContext.js";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import QuarkButton from "./QuarkButton.jsx";

// //FIXME TODO REMOVE BEFORE DEPLOY
// import "../../_nyafile/css/quarks/quarkSelector.css"
import {Tooltip} from "react-tooltip";

let animationFrames = [
    { width: "5.5rem", offset: 0},
    // { width: "10.75rem", offset: 0.2},
    // { width: "scale(1, 1.05)", offset: 0.2},
    // { width: "scale(1, 0.3)", offset: 0.4},
    { width: "26.25rem", offset: 0.8},
    { width: "25rem", offset: 1},
];

let reverseAnimationFrames = [
    { width: "25rem", offset: 0},
    // { width: "26rem", offset: 0.5},
    // { width: "27rem", offset: 0.15},
    // { width: "25rem", offset: 0.3},
    { width: "4.75rem", offset: 0.8},
    { width: "5.5rem", offset: 1}
    // { width: "scale(1, 1.05)", offset: 0.2},
    // { width: "scale(1, 0.3)", offset: 0.4},
];

let animationConfig = {
    duration: 300,
    iterations: 1,
    easing: "ease-out"
};

export default function QuarkSelector() {
    let {quarksInfo} = useContext(ClientContext)
    let nyaFile = new NyaFile()
    let {collapseSidebar, setCollapseSidebar} = useContext(ClientContext);
    let [collapse, setCollapse] = useState(collapseSidebar);

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

    useEffect(() => {
        let quarkSelector = document.querySelector("#quarkSelector");
        if (!collapseSidebar) {
            setCollapse(collapseSidebar)
            quarkSelector.animate(animationFrames, animationConfig)
        } else {
            quarkSelector.animate(reverseAnimationFrames, animationConfig)
            setTimeout(() => {
                setCollapse(collapseSidebar)
            }, 290)
        }
    }, [collapseSidebar])

    let [quarkIcons, setQuarkIcons] = useState([]);

    useEffect(() => {
        setQuarkIcons(quarksInfo.map((quark, index) => {
            return <QuarkButton key={quark._id} quark={quark} index={index} />
        }))
    }, [quarksInfo, setQuarkIcons])

    return (
        <>
            <div onTouchEnd={onTouchEnd} onTouchStart={onTouchStart} onTouchMove={onTouchMove}
                className={`QuarkSelector-containerWrapper${collapse ? " QuarkSelector-containerWrapper-collapsed" : ""}`} id="quarkSelector">
                <div className="QuarkSelector-top">
                    <button className="QuarkSelector-collapseButton" onClick={() => setCollapseSidebar(p => !p)}>≡</button>
                </div>
                <div className="QuarkSelector-container"
                     // style={{
                     //     display: false ? "none" : ""
                     //}}
                >
                    <StyleProvider nyaFile={nyaFile} asset={"css/quarks/quarkSelector"} />
                    <div id="channelPortal" className="QuarkSelector-channelWrapper">

                    </div>
                    <div className="QuarkSelector-contentWrapper"
                         style={{}}>
                        {quarkIcons}
                    </div>
                </div>
            </div>
            <Tooltip id={`quark-button-tip`}
                     className={"QuarkSelector-tooltip"}
                     noArrow={true}
            />
        </>
    )
}