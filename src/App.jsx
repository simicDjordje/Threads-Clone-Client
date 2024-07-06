import { Box, Button, Container } from '@chakra-ui/react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import ChatPage from './pages/ChatPage'
import UpdateProfilePage from './pages/UpdateProfilePage'
import Header from './components/Header'
import { useRecoilValue } from 'recoil'
import userAtom from './atoms/userAtom'
import LogoutButton from './components/LogoutButton'
import CreatePost from './components/CreatePost'
import GoBackButton from './components/GoBackButton'
import { useEffect, useState } from 'react'

const App = () => {

  const user = useRecoilValue(userAtom)
  const location = useLocation()
  const [backButtonVisible, setBackButtonVisible] = useState(true)

  useEffect(()=>{
    if(location.pathname === '/' || location.pathname === '/auth'){
      setBackButtonVisible(false)
      return
    }

    setBackButtonVisible(true)
  }, [location.pathname])
  
  return (
    <Box position={"relative"} w='full'>
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route path='/' element={user ? <HomePage /> : <Navigate to={'/auth'} />} />
          <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to={'/'} />} />
          <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to={'/auth'} />} />
          <Route path='/:username' element={<UserPage />} />
          <Route path='/:username/post/:pid' element={<PostPage />} />
          <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={'/auth'} />} />
        </Routes>
        {user && <LogoutButton />}
        {user && <CreatePost />}
        {backButtonVisible && <GoBackButton /> }
      </Container>
    </Box>
  )
}

export default App