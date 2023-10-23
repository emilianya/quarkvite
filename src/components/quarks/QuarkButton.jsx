import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {Link} from "react-router-dom";

// import "../../_nyafile/css/quarks/quarkButton.css"

export default function QuarkButton({quark}) {
    let nyaFile = new NyaFile();

    return (
        <Link to={`/${quark._id}`} style={{
        }}>
            <div className={"QuarkButton-container"}
                 data-tooltip-id={`quark-button-tip`}
                 data-tooltip-content={quark.name}
                 data-tooltip-place={"left"}
                 data-tooltip-position-strategy={"fixed"}
                 data-tooltip-offset={2}
                 data-tooltip-float={false}>
                <StyleProvider nyaFile={nyaFile} asset={"css/quarks/quarkButton"} />
                <img className={"QuarkButton-icon"} src={quark._id === "000000000000000000000000" ? nyaFile.getCachedData("assets/dm-icon") : quark.iconUri} alt={quark.name}/>
            </div>
        </Link>
    )
}