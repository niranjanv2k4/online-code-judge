import { useState } from "react"
import { FileInput, FileOutput, Loader2, Play, TerminalSquare, CheckCircle2, XCircle } from 'lucide-react'

type Props = {
    code: string
}


function ResultPanel({ code } : Props){
    
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [expected, setExpected] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("idle");

    async function handleInputSubmit(){
        
        setStatus("running");

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
            setOutput(data.output.trim())
        }else{
            setError(null)
            setOutput(data.output.trim())
        }

        // console.log(expected)
        // console.log(output)
        // console.log(data.status)

        setStatus("executed")

    }

    return (
        <div className={`
            border-l 
            w-[30%]
            h-screen 
            bg-slate-900
            p-2
            transition-all
            duration-700
            overflow-hidden
        `}>

            <div className="mt-5"> 
                <form action="">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <FileInput size={16} className="text-slate-500" />
                            Custom Input
                        </label>
                        <textarea 
                            name="" 
                            id="input" 
                            placeholder="Input"
                            className="bg-slate-950 text-slate-300 border border-gray-300 px-2 mt-2 pt-5 rounded-md w-full h-40"
                            onChange={ (e) =>  setInput(e.target.value) }
                            value={input}
                        >
                        </textarea>
                    </div>
                    <div className="mt-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <FileOutput size={16} className="text-slate-500" />
                            Expected Output
                        </label>
                        <textarea 
                            name="" 
                            id="expected" 
                            placeholder="Expected"
                            className="bg-slate-950 text-slate-300 border border-gray-300 px-2 mt-2 pt-5 rounded-md w-full h-40"
                            onChange={ (e) =>  setExpected(e.target.value) }
                            value={expected}
                        >
                        </textarea>
                    </div>
                    <button 
                        type="button"
                        className="text-white font-bold bg-indigo-600 w-full p-3 mt-5 rounded-md mt-2 transition-transform hover:scale-102 flex items-center justify-center"
                        onClick={handleInputSubmit}
                        disabled={status === "running"} > 
                        { status === "running"
                            ? 
                            (<>
                                <Loader2 size={18} className="animate-spin" />  Running... 
                            </>)
                            :
                            (<>
                                <Play size={18} className="currentColor" /> Run & Submit Code
                            </>)
                        }
                        </button>
                </form>
                
                { status !== "idle" && 
                    <div className="mt-8 flex flex-col">
                        <div className="flex">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                <TerminalSquare size={16} className="text-slate-500" />
                                Execution Output
                            </label>
                            <div className="ml-auto">
                                { error == null && 
                                <span className="flex items-center gap-1.5 text-[#0EA600] bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-[#0EA600]">
                                    <CheckCircle2 size={14} />
                                    Accepted
                                </span>}
                                { error && 
                                <span className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-400/20">
                                    <XCircle size={14} />
                                    Wrong answer
                                </span>}
                            </div>
                        </div>
                        <textarea 
                            name="" 
                            id="output" 
                            placeholder="Output"
                            className={`bg-slate-950 text-slate-300 border-3 px-2 mt-2 pt-5 rounded-md w-full h-50 ${ error ? "border-rose-400/20" : "border-[#0EA600]"}`}
                            onChange={ (e) =>  setOutput(e.target.value) }
                            value={output}
                            >
                        </textarea>
                    </div>
                }

                { status === "idle" && 
                    <div className="mt-8 flex flex-col">
                    <div className="flex">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <TerminalSquare size={16} className="text-slate-500" />
                            Execution Output
                        </label>
                    </div>
                    <textarea 
                        name="" 
                        id="output" 
                        placeholder="Output"
                        className={`bg-slate-950 text-slate-300 border border-gray-300 px-2 mt-2 pt-5 rounded-md w-full h-50`}
                        onChange={ (e) =>  setOutput(e.target.value) }
                        value={output}
                        >
                    </textarea>
                </div>
            }
            </div>
        </div>
    )
}


export default ResultPanel