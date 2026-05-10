import { useState } from 'react';
import { useAsyncError, useNavigate } from 'react-router-dom';

import ResultPanel from './ResultPanel';

function CodeArea() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  function handleGoBack () {
    navigate("/");
  }

  function handleClose(){
    setResult(null);
  }

  async function handleSubmit() {
    const response = await fetch("http://localhost:5000/process_code", {
      method: "POST",
      headers: {
        "Content-type" : "application/json"
      },
      body: JSON.stringify({
        code : text
      })
    });

    const data = await response.json(); // even though the backend returns a json object, here data is JS object
    setResult(data)
  }

  return (

    <div className='flex'>
      <div className={`transition-all duration-700 flex justify-center items-center flex-col p-4 h-screen 
      ${ result ? "w-[70%]" : "w-full"}`}>
        <div className='flex items-center w-full'>
          <label
            htmlFor="message"
            className="block mb-3 text-lg font-semibold text-gray-800"
          >
            Code Editor
          </label>
          <div className='m-4 ml-auto'>
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleGoBack }
              >
              Go Back
            </button>
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5 ml-2"
              onClick={ handleSubmit }
              form='codeForm'
              >
              Submit
            </button>
          </div>
        </div>
        <form id="codeForm" className='w-full h-full flex'>
          <textarea 
            id="message" 
            name="code"
            rows={4}
            className="flex-1 bg-gray-200 border border-gray-400 text-black rounded-md w-full p-3"
            placeholder="Write your thoughts here..."
            onChange={ (e) => setText(e.target.value) }
            value={text}>
          </textarea>
        </form>

      </div>
      <ResultPanel result={result} handleClose={handleClose}/>
    </div>
  )
}

export default CodeArea