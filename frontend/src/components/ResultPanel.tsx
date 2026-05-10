import { useState } from "react"

type Props = {
    result: {
        exit_code: number,
        status: string,
        output: string,
        container_id: string | null
    } | null
    handleClose: () =>void
}


function ResultPanel({ result, handleClose } : Props){
    
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [expected, setExpected] = useState("");

    const colorClasses = result?.exit_code === 0
        ? "text-[#0EA600] border-[#0EA600] hover:bg-[#0EA600]"
        : "text-red-600 border-red-600 hover:bg-red-600";

    async function handleInputSubmit(){
        
        const response = await fetch("http://localhost:5000/run", {
            method: 'POST',
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                input: input,
                expected: output,
                container_id: result.container_id
            })
        })

        const data = await response.json();
        console.log(data.output)
        setOutput(data.output)
    }

    return (
        <div className={`
            border-l 
            ${ result ? "w-[30%]" : "w-0"} 
            h-screen 
            bg-[#CADBC8]
            p-2
            transition-all
            duration-700
            overflow-hidden
            ${ result ? "translate-x-0" : "translate-x-full"}
        `}>
            <div className="flex items-center bg-gray-200 rounded-md p-2">
                { result && 
                <h3 className={`ml-4 text-lg font-bold ${ result.exit_code === 0
                    ? "text-[#0EA600]"
                    : "text-red-500"
                }`}> {result.status}
                </h3>}
                <button
                type="button"
                className={`ml-auto bg-white border hover:text-white focus:ring-4 focus:ring-gray-300 font-bold leading-5 rounded-xl text-sm px-6 py-2.5 focus:outline-none ${colorClasses}`}
                onClick={ handleClose }
                >
                CLOSE
                </button>
            </div>

            {result?.exit_code !== 0 && <div className="bg-gray-200 mt-2 p-2 rounded-md">
                {result?.output}
            </div>}

            { result?.exit_code === 0 && 
            <div> 
                <form action="">
                    <textarea 
                        name="" 
                        id="input" 
                        placeholder="Input"
                        className="bg-gray-200 border border-[#0EA600] px-2 mt-2 pt-5 rounded-md w-full"
                        onChange={ (e) =>  setInput(e.target.value) }
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
                    >
                    </textarea>
                    <button 
                        type="button"
                        className="text-white font-bold bg-[#0EA600] w-full p-3 rounded-md mt-2 transition-transform hover:scale-102"
                        onClick={handleInputSubmit} > SUBMIT </button>
                </form>
            </div>}
        </div>
    )
}


export default ResultPanel