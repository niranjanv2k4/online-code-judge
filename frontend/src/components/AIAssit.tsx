type Props = {
    showAI: boolean;
    aiWidth: number;
    isDragging: boolean;
};

function AIAssit({ showAI, aiWidth, isDragging }: Props) {
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
                <div className="max-w-[95%] rounded-[10px] bg-slate-800 border border-slate-700 px-3 py-2.5 text-[13px] leading-[1.5] text-slate-300">
                    Hi! I'm your AI coding assistant. Describe what you want and I'll generate the code for you.
                </div>
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
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

export default AIAssit;