import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["Hi there", "hello"])
  const inputRef = useRef()
  const wsRef = useRef()

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080")
    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws

    ws.onopen = () =>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    }

    return(() => {
      ws.close()
    })

  }, [])

  return (
    <div className='h-screen bg-black'>
      <br /><br />
       <div className='h-[95vh] '>
        {messages.map(message => 
          <div className='m-8 '>
            <span className='bg-white text-black rounded p-4'>
              {message}
            </span>
          </div>
        )}
       </div>
       <div className='w-full bg-white flex'>
        <input ref={inputRef} className='flex-1 p-4 rounded-md text-black bg-gray-300' type="text" placeholder='Chat' />
        <button
          onClick={() =>{
            const message = inputRef.current?.value
            wsRef.current.send(JSON.stringify({
              type:"chat",
              payload:{
                message:message
              }
            }))
          }}
         className='bg-purple-600 text-white rounded-lg px-2 py-1'>Submit</button>
       </div>
    </div>
  )
}

export default App
