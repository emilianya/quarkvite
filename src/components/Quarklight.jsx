import {useState} from 'react'
import NyaFile from "@litdevs/nyalib";


function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let nyaFile = new NyaFile()

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
        console.log(nyaFile.getCachedJson("assets/test"))
        console.log(nyaFile.getCachedJson("assets/test2"))
        console.log(nyaFile.getCachedJson("assets/test3"))
        //console.log(NyaFile._instance.getCachedJson("assets/test1"))
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
