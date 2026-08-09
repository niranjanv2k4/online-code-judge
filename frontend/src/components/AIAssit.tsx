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
                ${!isDragging ? "transition-all duration-300 ease-in-out" : ""}
                ${showAI ? "w-[300px] px-4 border-x border-slate-700" : "w-0 px-0 border-0"}
            `}
            style={ showAI ? {width: `${aiWidth}px`} : {}}
        >
            <div className="flex items-center gap-2 h-14 flex-shrink-0 border-b border-slate-700">
                <span>✨</span>
                <h3 className="text-sm font-semibold text-purple-400">
                    AI Assistant
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto py-3">
                AI ASSIST
            </div>
        </div>
    );
}

export default AIAssit;