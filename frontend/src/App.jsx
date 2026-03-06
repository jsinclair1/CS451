import { useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div>
      {showRegister ? (
        <Register onSwitch={() => setShowRegister(false)} />
      ) : (
        <Login onSwitch={() => setShowRegister(true)} />
      )}
    </div>
  )
}

export default App
