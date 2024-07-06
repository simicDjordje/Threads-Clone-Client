import { Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue, Box } from '@chakra-ui/react'
import { BsSearch } from 'react-icons/bs'
import Conversations from '../components/Conversations'
import { GiConversation } from "react-icons/gi"
import MessageContainer from '../components/MessageContainer'
import { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'


const ChatPage = () => {
    const showToast = useShowToast()
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [loadingConversations, setLoadingConversations] = useState(true)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchText, setSearchText] = useState('')
    const [searchingUser, setSearchingUser] = useState(false)
    const currentUser = useRecoilValue(userAtom)
    const {onlineUsers} = useSocket()
    const [messages, setMessages] = useState([])
    const {socket} = useSocket()

    useEffect(()=>{
        if(!socket) return

        socket.on('newMessage', (newMessage) => {
            if(selectedConversation && selectedConversation._id === newMessage.conversationId){
                setMessages(prevMessages => [...prevMessages, newMessage])
            }
            
            setConversations(prevConversations => {
                const conversationExist = prevConversations.find(i => i._id === newMessage.conversationId)
                
                if(conversationExist){
                    return prevConversations.map(conversation => {
                        if(conversation._id === newMessage.conversationId){
                            return {
                                ...conversation,
                                lastMessage: {
                                    message: newMessage.message,
                                    sender: newMessage.sender
                                }
                            }
                        }
    
                        return conversation
                    })   
                }

                //
                const customConversation = {
                    lastMessage: {
                        message: newMessage.message,
                        sender: newMessage.sender
                    },
                    _id: newMessage.conversationId,
                    participants: [
                        {
                            _id: newMessage.sender,
                            username: newMessage.sender_username
                        }
                    ],
                }
                //

                return [customConversation, ...prevConversations]
            })

        })

        return () => socket.off('newMessage')
    }, [socket, setConversations, selectedConversation])


    useEffect(()=>{
        if(!socket || !selectedConversation) return
        
        socket.on('messagesSeen', ({conversationId}) => {
            if(selectedConversation._id !== conversationId) return

            setMessages(prevMessages => {
                const updatedMessages = prevMessages.map(message => {
                    if(!message.seen){
                        return {
                            ...message,
                            seen: true
                        }
                    }

                    return message
                })

                return updatedMessages
            })

            setConversations(prevConversations => {
                const updatedConversations = prevConversations.map(conversation => {
                    if(conversation._id === selectedConversation._id){
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true
                            }
                        }
                    }

                    return conversation
                })

                return updatedConversations
            })
        })

        return () => socket.off('messagesSeen')
    }, [socket, selectedConversation, setConversations])

    useEffect(()=>{
        const getConversations = async () => {
            try{
                const response = await fetch('/api/v1/chat/conversations')
                const data = await response.json()
                
                if(!data.success){
                    showToast(data.message, 'error')
                    return
                }

                //remove my id from participants
                const updatedConversations = data.result.map(c => {
                    return {
                        ...c,
                        participants: c.participants.filter(i => i._id !== currentUser._id)
                    }
                })
                
                setConversations(updatedConversations)

            }catch(error){
                console.log(error)
            }finally{
                setLoadingConversations(false)
            }
        }

        getConversations()

        return () => {
            setSelectedConversation(null)
        }

    }, [showToast, setConversations, currentUser._id, setSelectedConversation])


    const handleConversationSearch = async () => {
        if(!searchText)return
        setSearchingUser(true)

        try{
            const response = await fetch(`/api/v1/users/profile/${searchText}`)
            const data = await response.json()
            
            if(!data.success){
                showToast(data.message, 'error')
                return
            }

            if(data.result._id === currentUser._id){
                showToast('You cannot message yourself', 'error')
                return
            }

            const conversationExist = conversations.find(conversation => conversation.participants[0]._id === data.result._id)
            if(conversationExist){
                setSelectedConversation(conversationExist)
                return
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    message: "",
                    sender: ""
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: data.result._id,
                        username: data.result.username
                    }
                ],
            }

            setSelectedConversation(mockConversation)
            setConversations(prevConversations => [mockConversation, ...prevConversations])

        }catch(error){
            console.log(error)
        }finally{
            setSearchingUser(false)
            setSearchText('')
        }
    }

  return (
    <Box
    position={"absolute"}
    left={"50%"}
    w={{ base: "100%", md: "80%", lg: "750px" }}
    p={4}
    transform={"translateX(-50%)"}
    >
    <Flex 
    gap={4} 
    flexDirection={{
        base: 'column',
        md: 'row'
    }}
    maxW={{
        sm: '400px',
        md: 'full'
    }}
    mx={'auto'}
    >
        <Flex flex={30} gap={3} flexDirection={'column'}>
            <Text fontWeight={700} color={useColorModeValue('gray.600', 'gray.400')}>
                Your Conversations
            </Text>
            <Flex gap={3} alignItems={'center'}>
                <Input onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleConversationSearch()
                    }
                    }} value={searchText} onChange={e => setSearchText(e.target.value)} placeholder='Search for a user' />
                <Button onClick={handleConversationSearch} isLoading={searchingUser}>
                    <BsSearch />
                </Button>
            </Flex>
            {loadingConversations && 
                (
                    [0,1,2,3,4].map((_, i) => (
                        <Flex key={i} gap={4} alignItems={'center'}>
                            <Box>
                                <SkeletonCircle size={10} />
                            </Box>
                            <Flex w={'full'} flexDirection={'column'} gap={2}>
                                <Skeleton h={'10px'} w={'80%'} />
                                <Skeleton h={'8px'} w={'90%'} />
                            </Flex>
                        </Flex>
                    ))
                )
            }

            {!loadingConversations && (
                conversations.map((conversation, index) => (
                    <Conversations 
                        key={index} 
                        conversation={conversation}
                        isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                    />
                ))
            )}
        </Flex>
        
        {!selectedConversation && <Flex 
        borderRadius={'md'} 
        flex={70} 
        p={2} 
        flexDirection={'column'} 
        alignItems={'center'}
        justifyContent={'center'}
        height={'400px'}
        >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
        </Flex> }

        {selectedConversation && <MessageContainer messages={messages} setMessages={setMessages} />}
    </Flex>
    </Box>
  )
}

export default ChatPage