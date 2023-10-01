import {useState} from 'react'

function Quarklight() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    const formSubmitHandler = (e) => {
        e.preventDefault();
        console.log(email, password)
    }

    return (<>
            <form onSubmit={formSubmitHandler}>
                <input type="email" onInput={(e) => setEmail(e.target.value)} autoComplete="email"/>
                <input type="password" onInput={(e) => setPassword(e.target.value)} autoComplete="current-password"/>
                <input type="submit"/>
            </form>
        </>)
}

export default Quarklight
