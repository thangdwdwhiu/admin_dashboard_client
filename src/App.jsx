import { useEffect } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { checkAuth } from './features/authSlice'

import SocketListener from './components/socket/SocketListener'

function App() {
    const dispatch = useDispatch()
    const handelCheckAuth = async () =>{
      try{
       await dispatch(checkAuth()).unwrap()
      }
      catch(err) {
        console.log(err)
        return <Navigate to={"/login"} replace/>
  
      }
    }
    // useSocketAuth()
    useEffect(() =>{

      handelCheckAuth()
    }, [])
  return (
    <>
          <SocketListener />
          <AppRoutes />
    </>
  )
}

export default App
