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
    setText("");
  }

  return (

    //UI
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
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5 ml-2"
            onClick={ handleSubmit }
            >
            Submit
          </button>
        </div>
      </div>
      <textarea 
        id="message" 
        rows={4}
        className="flex-1 bg-gray-200 border border-gray-400 text-black rounded-md w-full p-3"
        placeholder="Write your thoughts here..."
        onChange={ (e) => setText(e.target.value) }
        value={text}>
      </textarea>

    </div>
  )
}

export default CodeArea