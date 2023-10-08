import {useContext, useState} from 'react'
import NyaFile from "@litdevs/nyalib";
import AssetContext from "../context/AssetContext.js";


function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let {setNyaUrl} = useContext(AssetContext);
    let nyaFile = new NyaFile()

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
        setNyaUrl(password)
    }

    return (<div style={{backgroundImage: `url(${nyaFile.getCachedData("assets/testBackground")})`}}>
            <form onSubmit={formSubmitHandler}>
                <input type="email" onInput={(e) => setEmail(e.target.value)} autoComplete="email"/>
                <input type="password" onInput={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                <input type="submit"/>
            </form>
            {JSON.stringify(nyaFile.assetCache)}
            <img src={nyaFile.getCachedData("assets/spinner")}  alt={""}/>
        </div>)
}

export default Quarklight
