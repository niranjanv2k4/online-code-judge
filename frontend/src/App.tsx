import CodeArea from "./components/MainPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import Register from "./components/Register"

function App(){
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/" element={<CodeArea />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;