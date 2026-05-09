import { useNavigate } from "react-router-dom";


function Home(){

    const navigate = useNavigate();

    const name = "Niranjan"

    function handleClick(){
        navigate("/code-editor");
    }

    return (
        <div>
            <h1 className="text-red-500 text-6xl">Welcome {name}</h1>
            <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
            onClick={ handleClick }
            >
            Click here!!
            </button></div>
    )
}

export default Home;