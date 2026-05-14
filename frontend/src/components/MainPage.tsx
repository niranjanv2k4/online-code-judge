import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ResultPanel from './ResultPanel';

import CodeArea from './CodeArea';

function MainPage() {
  const navigate = useNavigate();

  const widthRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState("");
  const [width, setWidth] = useState(30);
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState("C");

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

  function handleReset(){
    setCode("");
  }

  return (

    <div className='flex bg-slate-900 h-screen' ref={widthRef} onMouseMove={handleResize}  onMouseUp={() => setDragging(false)}>
      <CodeArea code={code} language={language} handleReset={handleReset} setCode={setCode} setLanguage={setLanguage} />
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

export default MainPage