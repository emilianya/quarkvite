// 2 useEffect hooks here take care of the asset loading logic
import {useContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import logo from "../../assets/logo.svg";
import "../../style/spin.css";
import {NyaFile} from "@litdevs/nyalib";
import AssetContext from "../../context/AssetContext.js";
import localForage from "localforage";

export default function AssetLoader() {
    let [ready, setReady] = useState(false);
    let [defaultReady, setDefaultReady] = useState(false);
    let [spinnerText, setSpinnerText] = useState("Loading... (im probably broken)");
    let [spinnerSubText, setSpinnerSubText] = useState("Loading...");
    let [spinnerImage, setSpinnerImage] = useState(logo)
    let {nyaUrl} = useContext(AssetContext);
    let nyaFile = new NyaFile();
    let {setNyaUrl} = useContext(AssetContext);

    // Default asset load
    useEffect(() => {
        // Hacky thing to make sure this only happens once
        if (AssetLoader?.loadedBefore === true) return;
        AssetLoader.loadedBefore = true;

        setReady(false);
        (async () => {
            // Load the default assets
            setSpinnerText("Loading assets")
            setSpinnerSubText("Downloading nyafile")
            await nyaFile.load("/default.nya", true); // Load default assets
            setSpinnerImage(await nyaFile.getAssetDataUrl("assets/spinner"))
            setSpinnerSubText("Caching assets")

            // Load image assets
            nyaFile.queueCache("assets/spinner")
            // Load CSS for components
            nyaFile.queueCache("css/quarklight", "text")
            nyaFile.queueCache("css/loginForm", "text")
            nyaFile.queueCache("css/client", "text")
            nyaFile.queueCache("css/messages/message", "text")
            nyaFile.queueCache("css/messages/messageDisplay", "text")
            nyaFile.queueCache("css/messages/messageInput", "text")

            await nyaFile.waitAllCached()
            setSpinnerImage(nyaFile.getCachedData("assets/spinner"))

            let customNyaFile = await localForage.getItem("customNyaFile") || {url: ""};
            if (customNyaFile.url) {
                setNyaUrl(customNyaFile.url)
            }
            await localForage.setItem("customNyaFile", customNyaFile)

            setDefaultReady(true)
        })()
    }, []);

    // Custom asset load
    // When custom nya file url is changed from context kick client back to loader for full asset reload
    // If needed clear old nyafile, or just return
    useEffect(() => {
        if (!defaultReady) return;
        // If nyaUrl is empty or was cleared
        if (!nyaUrl) {
            let nyaFile = new NyaFile();
            // If it was cleared (there is a previous nyaFile) clear it from NyaFile and reload things
            // Otherwise return
            if (nyaFile.nyaFile) {
                // There was a nyafile set before, clear it
                setReady(false);
                (async () => {
                    // This should be as simple as clearing nyaFile.nyaFile and resetting cache right?
                    setSpinnerText("Removing custom nyafile")
                    setSpinnerSubText("Caching assets")
                    nyaFile.nyaFile = undefined;
                    await nyaFile.explodeCache()
                    setReady(true)
                })();
                return;
            }
            // "Why do you not just call setReady(true) in either case"
            // Because I'm not sure what kind of hell that would cause for anything that depends on ready
            if (!ready) {
                // This got called because of first load
                return setReady(true);
            }
            // Not cleared, this just got called for no reason so return, indicates some broken logic somewhere
            console.error("[AssetLoader] nyaUrl updated but no value and no previous nyaFile")
            return;
        }
        // Load new nya file, return to the spinner
        setReady(false);
        (async () => {
            setSpinnerText("Loading custom nyafile")
            setSpinnerSubText("Downloading nyafile")
            let nyaFile = new NyaFile();
            await nyaFile.load(nyaUrl);
            setSpinnerSubText("Caching assets")
            await nyaFile.waitAllCached()
            setSpinnerImage(nyaFile.getCachedData("assets/spinner"))
            setReady(true)
        })()

    }, [nyaUrl, defaultReady]);

    return <>
        {ready ? <Outlet/> : <Spinner text={spinnerText} subText={spinnerSubText} img={spinnerImage} />}
    </>
}

function Spinner({text, subText, img}) {
    if (typeof text === "undefined") throw new Error("Spinner missing text prop");

    return <div>
        <img src={img} alt={""} style={{animation: "spin 1s ease-in-out infinite"}}/>
        <p>{text}</p>
        <small>{subText}</small>
    </div>
}