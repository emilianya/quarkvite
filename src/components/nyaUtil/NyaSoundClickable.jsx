import NyaFile from "@litdevs/nyalib";
import React, {useEffect, useState} from "react";

export default function NyaSoundClickable({asset, children}) {
    const obtainNewAudio = () => {
        return new Promise(resolve => {
            let nyaFile = new NyaFile()
            nyaFile.getAssetDataUrl(asset, true).then(dataUrl => {
                resolve(new Audio(dataUrl))
            })
        })
    }

    let [sound, setSound] = useState(undefined)

    useEffect(() => {
        setSound(obtainNewAudio())
    }, []);

    const clickHandler = (child) => {
        return async (e) => {
            (await sound).play();
            setSound(obtainNewAudio())
            child.props.onClick(e)
        }
    }

    return <>
        {React.Children.map(children, child => (
            React.cloneElement(child, {onClick: clickHandler(child)})
        ))}
    </>
}