import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import Alert from "./Alert";

function Register(){

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleError(){
        setError(false);
    }

    async function handleRegister(){
        console.log(username)
        console.log(password)
        
        const response = await fetch("http://localhost:5000/register", {
            method: 'POST',
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await response.json();

        if(data.output === "SUCCESS"){
            localStorage.setItem("token", data.token);
            navigate("/code-editor");
        }else 
            setError(true);
            setErrorMessage(data.output);
            setTimeout(() => {
                setError(true)
            }, 3000);
    }

    return (
        <div>
            { error && <Alert handleError={handleError} message={errorMessage}/> }
            <form action="">
                <input type="text" className="border" placeholder="email/username" onChange={ (e) => setUsername(e.target.value) }/>
                <input type="password" className="border"placeholder="password" onChange={ (e) => setPassword(e.target.value) }/>

                <button

                type="button"
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
                onClick={ handleRegister }
                >
                    REGISTER
                </button>
            </form>
        </div>
    )
}

export default Register;