import {useContext, useEffect, useState} from "react";
import ClientContext from "../../context/ClientContext.js";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import QuarkButton from "./QuarkButton.jsx";

//FIXME TODO REMOVE BEFORE DEPLOY
import "../../_nyafile/css/quarks/quarkSelector.css"
import {Tooltip} from "react-tooltip";

export default function QuarkSelector() {
    let {quarksInfo} = useContext(ClientContext)
    let nyaFile = new NyaFile()

    let [quarkIcons, setQuarkIcons] = useState([]);

    useEffect(() => {
        setQuarkIcons(quarksInfo.map(quark => {
            return <QuarkButton key={quark._id} quark={quark} />
        }))
    }, [quarksInfo, setQuarkIcons])

    return (
        <>
            <div className="QuarkSelector-container">
                {/*<StyleProvider nyaFile={nyaFile} asset={"css/quarks/quarkSelector"} />*/}
                <div className="QuarkSelector-contentWrapper">
                    {quarkIcons}
                </div>
                <div id="channelPortal" className="QuarkSelector-channelWrapper">

                </div>
            </div>
            <Tooltip id={`quark-button-tip`}
                     className={"QuarkSelector-tooltip"}
                     noArrow={true}
            />
        </>
    )
}