
type Props = {
    result: {
        exit_code: number,
        status: string,
        output: string
    } | null
}


function ResultPanel({ result } : Props){

    if(result){
        return (
            <div className="border-l w-[30%] h-screen bg-gray-200 p-4">
                <h3 className={ result.exit_code === 0
                    ? "text-green-500"
                    : "text-red-500"
                }> {result.status} {result.output} </h3>
            </div>
        )
    }
}


export default ResultPanel