import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client'
import {useRecoilValue} from 'recoil'
import userAtom from "../atoms/userAtom";

const SocketContext = createContext()


export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const currentUser = useRecoilValue(userAtom)
    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(()=>{
        const socket = io('http://localhost:5000', {
            query: {
                userId: currentUser?._id
            }
        })

        setSocket(socket)
        
        socket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users)
        })

        return () => socket && socket.close()

    }, [currentUser?._id])

    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext)
}