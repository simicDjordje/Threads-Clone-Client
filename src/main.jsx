import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketContextProvider } from './context/SocketContext.jsx'
  // minified version is also included
  // import 'react-toastify/dist/ReactToastify.min.css';

const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props),
    }
  }) 
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
}


const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e'
  }
}

const theme = extendTheme({config, styles, colors})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
          <ToastContainer />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
)
