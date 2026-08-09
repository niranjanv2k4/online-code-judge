import { useState } from "react";
import { Loader2 } from "lucide-react"
import { useRef, useEffect } from "react";

type Props = {
    showAI: boolean;
    aiWidth: number;
    isDragging: boolean;
    language: string;
    setCode: (value: string) => void
};

function AIAssit({ showAI, aiWidth, isDragging, language, setCode }: Props) {

    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "ai", 
            content: "Hi! I'm your AI coding assistant. Describe what you want and I'll generate the code for you.",
            code: ""
        }]);

    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);
    
    function handleInsertCode(code: string){
        setCode(code);
    }
    
    async function handlePromptSubmit(){
        
        setIsGenerating(true);
        const res = await fetch("http://localhost:5000/generate_code", {
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                prompt: prompt,
                language: language,
                token: localStorage.getItem("token")
            })
        })
        
        setMessages(prev => [...prev, {
            role : "user",
            content: prompt,
            code: ""
        }]);
        setPrompt("");

        const data = await res.json();
        const code = data.code;
        const AIresponse = data.response;

        setMessages(prev => [...prev, {
            role: "ai",
            content: AIresponse,
            code: code
        }]);

        setIsGenerating(false);

    }

    return (
        <div
            className={`
                h-full
                flex-shrink-0
                overflow-hidden
                bg-slate-900
                flex
                flex-col
                p-4
                ${!isDragging ? "transition-all duration-300 ease-in-out" : ""}
                ${showAI ? "w-[300px] min-w-[260px] px-4 border-x border-slate-800" : "w-0 px-0 border-0"}
            `}
            style={ showAI ? {width: `${aiWidth}px`} : {}}
        >
            <div className="flex items-center gap-2 h-14 border-b border-slate-700 py-3">
                <span className="text-lg">✨</span>
                <h3 className="text-[15px] font-semibold text-violet-400">
                    AI Assistant
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
                    {messages.map((message, index) => (
                        <div 
                            key={index}
                            className={`
                                max-w-[95%] rounded-[10px] px-3 py-2.5 text-[13px] leading-[1.5]
                                ${message.role === "user" ? 
                                    "self-end bg-indigo-600 text-white" : 
                                    "self-start bg-slate-800 border border-slate-700 text-slate-300"
                                }
                                `}
                            >{message.content}
                            { message.code && (
                                <div className="mt-2">
                                    <pre className="bg-black mt-2 rounded-lg text-xs p-2 overflow-auto">
                                        { message.code }
                                    </pre>
                                    <button
                                        onClick={() => handleInsertCode(message.code)}
                                        className="
                                            mt-2
                                            w-full
                                            py-2
                                            rounded-lg
                                            bg-slate-700
                                            border border-slate-600
                                            text-slate-200
                                            text-xs
                                            font-medium
                                            hover:bg-slate-600
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        Insert Code
                                    </button>
                                </div>)}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 h-10">
                <input
                    className="
                        flex-1
                        min-w-0
                        shrink
                        h-full
                        bg-slate-800
                        border border-slate-700
                        rounded-lg
                        px-3
                        text-[13px]
                        text-slate-200
                        outline-none
                        focus:border-indigo-500
                    "
                    placeholder="Describe what you want..."
                    onChange={ (e) => setPrompt(e.target.value)}
                    value={prompt}
                />

                <button
                    className="
                        h-full
                        aspect-square
                        bg-indigo-600
                        text-white
                        rounded-lg
                        text-[13px]
                        cursor-pointer
                        flex
                        items-center
                        justify-center
                    "
                    onClick={handlePromptSubmit}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        "➤"
                    )}
                </button>
            </div>
        </div>
    );
}

export default AIAssit;