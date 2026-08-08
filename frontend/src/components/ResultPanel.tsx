import React, { useState } from "react"
import { FileInput, FileOutput, Loader2, Play, TerminalSquare, CheckCircle2, XCircle } from 'lucide-react'

type Props = {
    code: string
    width: number
    language: string
}


function ResultPanel({ code, width, language } : Props){
    
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [expected, setExpected] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("idle");

    function handleReset(){
        setInput("");
        setOutput("");
        setExpected("");
        setStatus("idle");
    }

    async function handleInputSubmit(){
        
        setStatus("running");

        const response = await fetch("http://localhost:5000/execute_code", {
            method: 'POST',
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                code: code,
                language: language,
                input: input,
                expected: expected,
                token: localStorage.getItem("token")
            })
        })

        const data = await response.json();
        console.log(data)
        if(data.status !== "SUCCESS"){
            setError(data.output)
            setOutput(data.output.trim())
        }else{
            setError(null)
            setOutput(data.output.trim())
        }

        setStatus("executed")

    }

    return (
        <div className={`h-full flex flex-col overflow-hidden p-4`} style={{ width: `${width}%`,minWidth: "300px",maxWidth: "50%" }}>
            <div className="flex items-center border-b border-slate-800 h-16">
                <label
                htmlFor="message"
                className="block text-lg font-semibold text-slate-300  px-4 py-3"
                >
                    TEST CASES
                </label>
                <button
                type="button"
                className="ml-auto w-28 text-white bg-indigo-600 hover:bg-blue-600 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
                onClick={ handleReset }
                >
                Reset
                </button>
            </div>
            <div className={`
                w-full
                flex-1
                min-h-0
                box-border
                bg-slate-900
                mt-4
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
                                className="bg-slate-950 text-slate-300 border rborder-gray-300 px-2 mt-2 pt-5 rounded-md w-full h-40"
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
                            className="text-white font-bold bg-indigo-600 w-full p-3 mt-5 rounded-md mt-2 transition-transform hover:scale-101 flex items-center justify-center"
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
                    
                    { status === "executed" && 
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
        </div>
    )
}


export default ResultPanel