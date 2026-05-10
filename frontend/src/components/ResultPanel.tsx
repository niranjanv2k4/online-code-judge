
type Props = {
    result: {
        exit_code: number,
        status: string,
        output: string
    } | null
}


function ResultPanel({ result } : Props){

    return (
        <div className={`
            border-l 
            ${ result ? "w-[30%]" : "w-0"} 
            h-screen 
            bg-gray-200 
            p-4
            transition-all
            duration-700
            ${ result ? "translate-x-0" : "translate-x-full"}
        `}>
            { result && <h3 className={ result.exit_code === 0
                ? "text-green-500"
                : "text-red-500"
            }> {result.status} {result.output} </h3>}
        </div>
    )
}


export default ResultPanel