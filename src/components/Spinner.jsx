import {NyaFile} from "@litdevs/nyalib";

export default function Spinner({text, subText}) {
    let nyaFile = new NyaFile();
    return <>
        <div>
            <img src={nyaFile.getCachedData("assets/spinner")} alt={""} style={{animation: "spin 1s ease-in-out infinite"}}/>
            <p>{text}</p>
            <small>{subText}</small>
        </div>
    </>
}