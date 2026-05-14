
type Props = {
    message: string
    handleError : () => void
}

function Alert({ message, handleError } : Props){

    return (
        <div
        className="flex items-center p-4 mb-4 text-sm text-red-300 bg-slate-800 border border-red-500 rounded-lg"
        role="alert"
        >
            <svg
                className="w-4 h-4 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86l-7.5 13A1 1 0 0 0 3.66 18h16.68a1 1 0 0 0 .87-1.5l-7.5-13a1 1 0 0 0-1.74 0Z"
                />
            </svg>

            <div className="ml-3">
                {message}
            </div>

            <button
                type="button"
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-700"
                onClick={handleError}
            >
                <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
                </svg>
            </button>
        </div>
    )
}

export default Alert