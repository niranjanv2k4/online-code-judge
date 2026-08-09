import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ResultPanel from './ResultPanel';

import CodeArea from './CodeArea';
import AIAssit from './AIAssit'

function MainPage() {
  const navigate = useNavigate();

  const widthRef = useRef<HTMLDivElement>(null);

  const [code, setCode] = useState("");
  const [width, setWidth] = useState(400);
  const [dragging, setResultPanelDragging] = useState(false);
  const [language, setLanguage] = useState("C");
  const [showAI, setAIAssit] = useState(false);

  const [aiWidth, setAIWidth] = useState(300);
  const [dragginai, setDraggingAI] = useState(true);

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

  function handleResizeResultPanel(e : React.MouseEvent<HTMLDivElement>){
    if (!dragging) return;
    
    const containerWidth = widthRef.current!.clientWidth;
    const resultWidth = containerWidth - e.clientX;
    
    setWidth(Math.min(containerWidth * 0.5, Math.max(280, resultWidth)));
  }

  function handleResizeAIPanel(e : React.MouseEvent<HTMLDivElement>){
    if(!dragginai)
      return
     
    const containerWidth = widthRef.current!.clientWidth;
    const aiPanelWidth = (containerWidth - e.clientX - width);
  
    setAIWidth(Math.min(500, Math.max(200, aiPanelWidth)))
  }


  function handleReset(){
    setCode("");
  }

  return (

    <div className='flex bg-slate-900 h-screen' ref={widthRef} onMouseMove={ (e) => { handleResizeResultPanel(e); handleResizeAIPanel(e) }}  onMouseUp={() => {setResultPanelDragging(false); setDraggingAI(false)}}>
      <CodeArea code={code} language={language} handleReset={handleReset} setCode={setCode} setLanguage={setLanguage} setAIAssit={setAIAssit} AIAssit={showAI}/>
      {/* {showAI ? <AIAssit showAI={showAI}/> : null} */}

      <div
        className="
            w-1
            flex-shrink-0
            bg-slate-700
            hover:bg-indigo-500
            cursor-col-resize
            transition-colors
        "
        onMouseDown={ () => setDraggingAI(true) }
      />

      <AIAssit showAI={showAI} aiWidth={aiWidth} isDragging={dragginai} language={language} setCode={setCode}/>

      <div
        className="
            w-1
            flex-shrink-0
            bg-slate-700
            hover:bg-indigo-500
            transition-colors
        "
        onMouseDown={ () => setResultPanelDragging(true) }
      />
      <ResultPanel code={code} width={width} language={language}/>
    </div>
  )
}

export default MainPage