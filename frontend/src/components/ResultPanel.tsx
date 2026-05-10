import { useState } from "react"

type Props = {
    code: string
}


function ResultPanel({ code } : Props){
    
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [expected, setExpected] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleInputSubmit(){
        
        const response = await fetch("http://localhost:5000/execute_code", {
            method: 'POST',
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                code: code,
                input: input,
                expected: expected,
            })
        })

        const data = await response.json();

        if(data.status === "FAILURE"){
            setError(data.output)
            setOutput("")
            setInput("")
            setExpected("")
        }else{
            setError(null)
            setOutput(data.output)
        }
    }

    return (
        <div className={`
            border-l 
            w-[30%]
            h-screen 
            bg-[#CADBC8]
            p-2
            transition-all
            duration-700
            overflow-hidden
        `}>
            <div className="flex items-center justify-center bg-gray-200 rounded-md p-2">
                <h3 className="ml-4 text-lg font-bold text-[#0EA600]"> 
                    RUN YOUR CODE
                </h3>
            </div>

            <div> 
                <form action="">
                    <textarea 
                        name="" 
                        id="input" 
                        placeholder="Input"
                        className="bg-gray-200 border border-[#0EA600] px-2 mt-2 pt-5 rounded-md w-full"
                        onChange={ (e) =>  setInput(e.target.value) }
                        value={input}
                    >
                    </textarea>
                    <textarea 
                        name="" 
                        id="output" 
                        placeholder="Output"
                        className="bg-gray-200 border border-[#0EA600] px-2 mt-2 pt-5 rounded-md w-full"
                        onChange={ (e) =>  setOutput(e.target.value) }
                        value={output}
                        >
                    </textarea>
                    <textarea 
                        name="" 
                        id="expected" 
                        placeholder="Expected"
                        className="bg-gray-200 border border-[#0EA600] px-2 mt-2 pt-5 rounded-md w-full"
                        onChange={ (e) =>  setExpected(e.target.value) }
                        value={expected}
                    >
                    </textarea>
                    <button 
                        type="button"
                        className="text-white font-bold bg-[#0EA600] w-full p-3 rounded-md mt-2 transition-transform hover:scale-102"
                        onClick={handleInputSubmit} > SUBMIT </button>
                </form>
            </div>

            { error && 
                <div className="bg-gray-200 rounded-md mt-2 p-4 text-red-500"> {error} </div>
            }
        </div>
    )
}


export default ResultPanel