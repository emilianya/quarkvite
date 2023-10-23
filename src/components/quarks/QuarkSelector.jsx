import {useContext, useEffect, useState} from "react";
import ClientContext from "../../context/ClientContext.js";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import QuarkButton from "./QuarkButton.jsx";

// //FIXME TODO REMOVE BEFORE DEPLOY
// import "../../_nyafile/css/quarks/quarkSelector.css"
import {Tooltip} from "react-tooltip";

export default function QuarkSelector() {
    let {quarksInfo} = useContext(ClientContext)
    let [collapsed, setCollapsed] = useState(window.innerWidth < 500);
    let nyaFile = new NyaFile()

    let [quarkIcons, setQuarkIcons] = useState([]);

    useEffect(() => {
        setQuarkIcons(quarksInfo.map((quark, index) => {
            return <QuarkButton key={quark._id} quark={quark} index={index} />
        }))
    }, [quarksInfo, setQuarkIcons])

    return (
        <>
            <div className="QuarkSelector-containerWrapper">
                <div className="QuarkSelector-top">
                    <button className="QuarkSelector-collapseButton" onClick={() => setCollapsed(p => !p)}>≡</button>
                </div>
                <div className="QuarkSelector-container"
                     style={{
                         display: collapsed ? "none" : ""
                     }}>
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