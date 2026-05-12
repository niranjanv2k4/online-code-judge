import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import ResultPanel from './ResultPanel';

function CodeArea() {
  const navigate = useNavigate();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState("");
  
  const lines = code.split("\n").length
  const arr = Array.from({ length: lines }, (_, i) => i + 1);

  function handleGoBack () {
    navigate("/");
  }

  function handleScroll(e: React.UIEvent<HTMLTextAreaElement>){
    if (lineRef.current) {
      lineRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>){
    if(e.key === "Tab"){
      e.preventDefault()
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      setCode(code.slice(0, start) + "\t" + code.slice(end))

      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + 1;
          textAreaRef.current.selectionEnd = start + 1;
        }
      }, 0);
    }
  }

  return (

    <div className='flex bg-slate-900 '>
      <div className="transition-all duration-700 flex justify-center items-center flex-col p-4 h-screen w-[70%]">
        <div className='flex items-center w-full'>
          <label
            htmlFor="message"
            className="block mb-3 text-lg font-semibold text-slate-300"
          >
            Code Editor
          </label>
          <div className='m-4 ml-auto'>
            <button
              type="button"
              className="text-white bg-indigo-600 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleGoBack }
              >
              Go Back
            </button>

            <button
              type="button"
              className="text-white bg-indigo-600 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleGoBack }
              >
              Go Back
            </button>
          </div>
        </div>
        <div className='w-full h-full flex overflow-hidden'>
          <div 
            className='text-white w-[2%] overflow-hidden bg-slate-700 border border-gray-400 rounded-l-md flex items-center p-3 flex-col'
            ref={lineRef}
            > 
            {arr.map((value) => (
              <div className='text-xs font-semibold leading-6'>{value}</div>
            ))} 
          </div>
          <form id="codeForm" className='w-full h-full flex'>
            <textarea 
              id="message" 
              name="code"
              rows={4}
              className="flex-1 bg-slate-700 border border-gray-400 text-white rounded-r-md w-full p-3 focus:outline-none focus:ring-0 leading-6"
              placeholder="Code here..."
              onChange={ (e) => setCode(e.target.value) }
              onKeyDown={ handleKeyDown }
              onScroll={ handleScroll }
              value={code}
              ref={textAreaRef}>
            </textarea>
          </form>
        </div>

      </div>
      <ResultPanel code={code}/>
    </div>
  )
}

export default CodeArea