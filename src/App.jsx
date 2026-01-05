import { useEffect } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { checkAuth } from './features/authSlice'

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
    useEffect(() =>{
      handelCheckAuth()
    }, [])
  return (
    <>
          <AppRoutes />
    </>
  )
}

export default App
