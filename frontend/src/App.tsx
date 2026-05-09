import { useState } from 'react';

function App() {

  //Logic
  const [ count, setCount ] = useState(0);
  const name = "niranjan";
  var normal_count = 0;

  return (

    //UI
    <div>
      <h1>My first react app</h1>
      <p>Hello {name}</p>
      <h2>COUNT: {count}  {normal_count}</h2>
      <button onClick={() => { setCount(count + 1); normal_count++} }>increment</button>
      <button onClick={() => { setCount(count - 1); normal_count--} }>decrement</button>
    </div>
  )
}

export default App