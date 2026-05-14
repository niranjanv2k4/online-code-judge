import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ResultPanel from './ResultPanel';
import { User, CodeXml } from 'lucide-react';


function CodeArea() {
  const navigate = useNavigate();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState("");
  const [width, setWidth] = useState(30);
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState("C");
  const [isOpen, setIsOpen] = useState(false);
  
  const lines = code.split("\n").length
  const arr = Array.from({ length: lines }, (_, i) => i + 1);

  useEffect(() => {
    async function verify_token() {
      const token = localStorage.getItem("token");

      if(!token)
        navigate("/login");
      
      const response = await fetch("http://localhost:5000/verify_token", {
        method: 'POST',
        headers: {
          "Content-type" : "application/json"
        },
        body: JSON.stringify({
          token: localStorage.getItem("token")
        })
      })
      
      const data = await response.json();
      
      if(!data.valid)
        navigate("/login");
    }

    verify_token();
  }, []);

  function handleResize(e : React.MouseEvent<HTMLDivElement>){
    if(dragging){
      var pos = e.clientX;
      var percentage = (pos / widthRef.current.clientWidth) * 100;
      setWidth(100 - percentage)
    }
  }
  function handleLogOut () {
    localStorage.removeItem("token")
    navigate("/login")
  }

  function handleScroll(e: React.UIEvent<HTMLTextAreaElement>){
    if (lineRef.current) {
      lineRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  }

  function handleReset(){
    setCode("");
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

    <div className='flex bg-slate-900 h-screen' ref={widthRef} onMouseMove={handleResize}  onMouseUp={() => setDragging(false)}>
      <div className="transition-all duration-700 flex flex-col p-4 h-full flex-1 box-border overflow-hidden">
        <div className='flex items-center w-full border-b border-slate-800 h-16'>
          <div className="flex items-center justify-between px-4 py-3">

            <div className="flex items-center gap-3">

              <CodeXml size={22} className="text-slate-300" />

              <h2 className="text-lg font-semibold text-slate-200">
                Code Editor
              </h2>

              <div className="h-5 w-px bg-slate-700"></div>

            </div>

            {/* Right Section */}
            <div className="relative inline-block text-left">

              <button
                onClick={() => setIsOpen(true)}
                className="w-20 flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700 transition hover:bg-slate-700"
              >
                {language}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-400 ml-auto"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {isOpen && 
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-slate-700">

                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700" onClick={() => {setIsOpen(false); setLanguage("C")}}>
                  C
                </button>

                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700" onClick={() => {setIsOpen(false); setLanguage("C++")}}>
                  C++
                </button>
              </div>}
              

            </div>
          </div>
          <div className='gap-4 flex ml-auto'>
            <button
              type="button"
              className="w-28 text-white bg-indigo-600 hover:bg-blue-600 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleReset }
              >
              Reset
            </button>

            <button
              type="button"
              className="w-28 text-white bg-indigo-600 hover:bg-blue-600 shadow-md font-medium rounded-lg text-sm px-4 py-2.5"
              onClick={ handleLogOut }
              >
              Log Out
            </button>

            <User size={40} className='text- bg-slate-300 border rounded-full border-black' />
          </div>
        </div>
        <div className='w-full min-h-0 flex flex-1 overflow-hidden  mt-4'>
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
      <div className='flex flex-col text-white justify-center w-1
        bg-slate-700
        hover:bg-indigo-500
        cursor-col-resize
        transition-colors' onMouseDown={ () => setDragging(true)}>
      </div>
      <ResultPanel code={code} width={width} language={language}/>
    </div>
  )
}

export default CodeArea