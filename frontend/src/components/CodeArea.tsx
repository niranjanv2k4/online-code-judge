import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CodeArea() {
  const navigate = useNavigate();

  const [text, setText] = useState("");

  function handleGoBack () {
    navigate("/");
  }

  function handleSubmit() {
    console.log(text);
  }

  return (

    <div className="flex justify-center items-center flex-col p-4 h-screen">
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
            type="submit"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5 ml-2"
            onClick={ handleSubmit }
            form='codeForm'
            >
            Submit
          </button>
        </div>
      </div>
      <form id="codeForm" action="http://localhost:5000/process_code" method='POST' className='w-full h-full flex'>
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
  )
}

export default CodeArea