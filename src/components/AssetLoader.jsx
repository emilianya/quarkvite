import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import logo from "../assets/react.svg";
import "../style/spin.css";
import NyaFile from "@litdevs/nyalib";

export default function AssetLoader() {
    let [ready, setReady] = useState(false);
    let [spinnerText, setSpinnerText] = useState("Loading...");
    let [spinnerImage, setSpinnerImage] = useState(logo)

    useEffect(() => {
        (async () => {
            // Create an instance of the NyaFile class, and load the default assets
            setSpinnerText("Loading default assets")
            let nyaFile = new NyaFile();
            await nyaFile.load("https://lightquark.network/default.nya", true); // Load default assets

            // Update the spinner asset from the default file
            setSpinnerText("Updating spinner")
            setSpinnerImage(await nyaFile.getImageAssetDataUrl("assets/spinner"))
            setSpinnerText("Seeing if default nyafile worked")

            // After a second load the custom nyafile and update spinner again, this time it should be coming from not-default
            setTimeout(async () => {
                setSpinnerText("Loading custom nyafile")
                await nyaFile.load("https://lightquark.network/not-default.nya");
                setSpinnerText("Seeing if custom nyafile worked")
                setSpinnerImage(await nyaFile.getImageAssetDataUrl("assets/spinner"))
            }, 1000)

            // After another second set ready to true
            setTimeout(async () => {
                setReady(true)
            }, 2000)
        })()
    }, []);

    return <>
        {ready ? <Outlet/> : <Spinner text={spinnerText} img={spinnerImage} />}
    </>
}

function Spinner({text, img}) {
    if (typeof text === "undefined") throw new Error("Spinner missing text prop");

    return <div>
        <img src={img} alt={""} style={{animation: "spin 2.5s linear infinite"}}/>
        <p>{text}</p>
    </div>
}