import CodeArea from "./components/CodeArea";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import Register from "./components/Register"

function App(){
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/code-editor" element={<CodeArea />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;