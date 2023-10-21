import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import {Link} from "react-router-dom";

export default function QuarkButton({quark}) {
    let nyaFile = new NyaFile();

    return (
        <Link to={`/${quark._id}`}>
            <div className={"QuarkButton-container"}>
                <StyleProvider nyaFile={nyaFile} asset={"css/quarks/quarkButton"} />
                <img className={"QuarkButton-icon"} src={quark.iconUri} alt={quark.name} title={quark.name}/>
                <small>{quark.name}</small>
            </div>
        </Link>
    )
}