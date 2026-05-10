
type Props = {
    result: {
        exit_code: number,
        status: string,
        output: string
    } | null
    handleClose: () =>void
}


function ResultPanel({ result, handleClose } : Props){
    
    const colorClasses = result?.exit_code === 0
        ? "text-[#18FF00] border-[#18FF00] hover:bg-[#18FF00]"
        : "text-red-600 border-red-600 hover:bg-red-600";

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
                    ? "text-[#18FF00]"
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

            {result && <div className="bg-gray-200 mt-2 p-2 rounded-md">
                {result.output}
            </div>}
        </div>
    )
}


export default ResultPanel