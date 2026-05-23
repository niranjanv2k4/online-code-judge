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
        
        if(username.trim() === '' || password.trim() === ''){
            setErrorMessage("INVALID CREDENTIALS");
            setError(true);
            setTimeout(() => {
                setError(false)
            }, 3000);
            return;
        }
        
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
            navigate("/");
        }else {
            setError(true);
            setErrorMessage(data.output);
            setTimeout(() => {
                setError(true)
            }, 3000);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="relative w-full max-w-md">

                {error && (
                    <div className="absolute -top-24 left-0 right-0 z-50">
                        <Alert handleError={handleError} message={errorMessage} />
                    </div>
                )}

                <div className="w-full bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">

                    <h1 className="text-3xl font-bold text-white text-center mb-8">
                        Register
                    </h1>

                    <form action="" className="flex flex-col gap-4">

                        <input
                            type="text"
                            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="Email / Username"
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            type="password"
                            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </form>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            className="flex-1 text-white bg-slate-700 hover:bg-slate-600 font-medium rounded-lg px-4 py-3 transition"
                            onClick={handleRegister}
                        >
                            REGISTER
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register;