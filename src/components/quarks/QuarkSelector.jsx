import {useContext, useEffect, useRef, useState} from "react";
import ClientContext from "../../context/ClientContext.js";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import QuarkButton from "./QuarkButton.jsx";
import {Tooltip} from "react-tooltip";
import {useMediaQuery} from "react-responsive";

export default function QuarkSelector() {
    let {quarksInfo} = useContext(ClientContext)
    let nyaFile = new NyaFile()
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
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
        let nyaFile = new NyaFile()
        let quarkSelector = document.querySelector("#quarkSelector");
        if (!collapseSidebar) {
            let animation = nyaFile.getCachedJson("animations/sidebarCollapse")
            setCollapse(collapseSidebar)
            quarkSelector.animate(animation.frames, animation.config)
        } else {
            let animation = nyaFile.getCachedJson("animations/sidebarOpen")
            quarkSelector.animate(animation.frames, animation.config)
            setTimeout(() => {
                setCollapse(collapseSidebar)
            }, animation.timeout)
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
                <div className="QuarkSelector-container">
                    <StyleProvider nyaFile={nyaFile} asset={"css/quarks/quarkSelector"} />
                    <div id="channelPortal" className="QuarkSelector-channelWrapper">

                    </div>
                    <div className="QuarkSelector-contentWrapper"
                         style={{}}>
                        {quarkIcons}
                    </div>
                </div>
            </div>
            {!isMobile && <Tooltip id={`quark-button-tip`}
                      className={"QuarkSelector-tooltip"}
                      noArrow={true}
            />}
        </>
    )
}