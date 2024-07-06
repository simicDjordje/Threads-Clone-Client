import { Avatar, Flex, useColorModeValue, Text, Image, Divider, SkeletonCircle, Skeleton, Box } from "@chakra-ui/react"
import Message from "./Message"
import { MessageInput } from "./MessageInput"
import { useEffect, useRef, useState } from "react"
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messagesAtom"
import userAtom from "../atoms/userAtom"
import { useSocket } from "../context/SocketContext"
import usePreviewImage from "../hooks/usePreviewImage"
import { IoMdCloseCircle } from "react-icons/io"
import {motion} from 'framer-motion'


const MessageContainer = ({messages, setMessages}) => {
    const showToast = useShowToast()
    const [selectedConversation] = useRecoilState(selectedConversationAtom)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const currentUser = useRecoilValue(userAtom)
    const messageEndRef = useRef(null)
    const {socket} = useSocket()
    const {handleImgChange, imgUrl, setImgUrl} = usePreviewImage()

    useEffect(()=>{
        if(!messages.length) return

        const isMessageFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id
        
        if(!isMessageFromOtherUser) return

        socket.emit('markMessagesAsSeen', {
            conversationId: selectedConversation._id,
            userId: selectedConversation.participants[0]._id
        })


        // return () => socket.off('newMessage')


    }, [socket, currentUser, messages, selectedConversation, setMessages])

    useEffect(()=>{
        const getMessages = async () => {
            setLoadingMessages(true)
            try{
                if(selectedConversation.mock){
                    setMessages([])
                    return
                }

                const response = await fetch(`/api/v1/chat/${selectedConversation.participants[0]._id}`)
                const data = await response.json()
                
                if(!data.success){
                    showToast(data.message, 'error')
                    return
                }

                setMessages(data.result)

            }catch(error){
                console.log(error)
            }finally{
                setLoadingMessages(false)
            }
        }

        getMessages()
    }, [showToast, setLoadingMessages, selectedConversation.participants, selectedConversation.mock, setMessages])

    useEffect(()=>{
        messageEndRef?.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

  return (
    <Flex 
    bg={useColorModeValue('gray.100', 'gray.dark')} 
    flex={70}
    p={1}
    borderRadius={'md'}
    flexDirection={'column'}
    position={'relative'}
    >
        {/* Message Header */}
        <Flex w={'full'} h={12} alignItems={'center'} gap={2} p={1}>
            <Avatar src={`/photos/profile-photo${selectedConversation.participants[0]._id}.png`} size='sm' />
            <Text display={'flex'} alignItems={'center'}>
                {selectedConversation.participants[0].username} <Image src="/verified.png" w={4} h={4} ml={1} />
            </Text>
        </Flex>

        <Divider />

        {/* Messages */}
        <Flex flexDirection={'column'} gap={4} my={4} p={2} height={'400px'} overflowY={'auto'}
        css={{
            "::-webkit-scrollbar": {
              display: "none" // Hide the scrollbar
            }
          }}
        >
            {loadingMessages && 
                (
                    [0,1,2,3,4].map((_, i) => (
                        <Flex 
                        key={i} 
                        gap={2} 
                        p={1} 
                        borderRadius={'md'} 
                        alignItems={'center'}
                        alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
                        >
                           {i % 2 === 0 && <SkeletonCircle size={7} />}
                           <Flex flexDir={'column'} gap={2}>
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                           </Flex>
                           {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))
                )
            }

            {!loadingMessages && (
                messages.map((message, index) => (
                    <Flex key={index} ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null} direction={'column'}>
                        <Message ownMessage={message?.sender === currentUser._id} message={message} />
                    </Flex>
                ))
            )}
        </Flex>

        {imgUrl && 
            <Box
            as={motion.div}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            position={'absolute'} 
            w={20} 
            bottom={12} 
            left={1}>
                <Box onClick={() => {setImgUrl(null)}} position={'absolute'} top={-2} right={-2} cursor={'pointer'}>
                    <IoMdCloseCircle />
                </Box>
                <Image objectFit={'cover'} w={20} h={20} borderRadius={6} overflow={'hidden'} border={'2px solid'} borderColor={'gray.light'} src={imgUrl} />
            </Box>
        } 

        <MessageInput
            imgUrl={imgUrl}
            setImgUrl={setImgUrl}
            handleImgChange={handleImgChange}
            setMessages={setMessages} />
    </Flex>
  )
}

export default MessageContainer