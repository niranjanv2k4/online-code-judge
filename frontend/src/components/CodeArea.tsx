import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ResultPanel from './ResultPanel';

function CodeArea() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");

  function handleGoBack () {
    navigate("/");
  }

  return (

    <div className='flex'>
      <div className="transition-all duration-700 flex justify-center items-center flex-col p-4 h-screen w-[70%]">
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
          </div>
        </div>
        <form id="codeForm" className='w-full h-full flex'>
          <textarea 
            id="message" 
            name="code"
            rows={4}
            className="flex-1 bg-gray-200 border border-gray-400 text-black rounded-md w-full p-3"
            placeholder="Code here..."
            onChange={ (e) => setCode(e.target.value) }>
          </textarea>
        </form>

      </div>
      <ResultPanel code={code}/>
    </div>
  )
}

export default CodeArea