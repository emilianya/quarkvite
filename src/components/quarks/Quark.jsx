import {Outlet, useParams} from "react-router-dom";
import {useContext, useMemo} from "react";
import ClientContext from "../../context/ClientContext.js";
import {NyaFile, StyleProvider} from "@litdevs/nyalib";
import ChannelSelector from "../channels/ChannelSelector.jsx";

export default function Quark() {
    let { quarkId } = useParams();
    let nyaFile = new NyaFile();
    let {quarksInfo} = useContext(ClientContext);

    let quark = useMemo(() => quarksInfo.find(quark => quark._id === quarkId), [quarkId, quarksInfo])

    return (
        <>
            <StyleProvider nyaFile={nyaFile} asset={"css/quarks/quark"} />
            Current quark is: {quark.name} ({quark._id})
            <ChannelSelector quark={quark} />
            <Outlet />
        </>
    )
}