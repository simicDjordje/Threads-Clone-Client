import { Button, Flex, Input, InputGroup, InputRightElement, Box, Image } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { IoSendSharp } from "react-icons/io5"
import useShowToast from "../hooks/useShowToast"
import { useRecoilState, useSetRecoilState } from "recoil"
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom"
import { FaImage } from "react-icons/fa6"
import { v4 as uuidv4 } from 'uuid'


export const MessageInput = ({setMessages, handleImgChange, setImgUrl, imgUrl}) => {
  const [input, setInput] = useState('')
  const showToast = useShowToast()
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const [messageSending, setMessageSending] = useState(false)
  const [conversations, setConversations] = useRecoilState(conversationsAtom)
  const inputRef = useRef(null)
  const [data, setData] = useState(null)
  const [oldMockId, setOldMockId] = useState(null)
  const fileRef = useRef(null)

  useEffect(()=>{
    if(imgUrl === null){
      fileRef.current.value = ''
    }
  }, [imgUrl])

  useEffect(() => {
    inputRef.current.focus()
  }, [selectedConversation])

  const handleSendMessage = async () => {
    if(!input && !imgUrl)return

    try{
      setMessageSending(true)
      const formData = new FormData()
      formData.append('recipientId', selectedConversation.participants[0]._id)
      formData.append('message', input)
      if(imgUrl){
        formData.append('photoId', imgUrl ? `${uuidv4()}${Math.random()}` : 'none')
        formData.append('message-photo', fileRef.current.files[0])
      }

      const response = await fetch(`/api/v1/chat/send`, {
        method: 'POST',
        //headers: {'Content-Type': 'application/json'},
        body: formData
      })

      const messageData = await response.json()

      if(!messageData.success){
        showToast(messageData.message, 'error')
        return
      }
      
      if(imgUrl){
        setImgUrl(null)
        fileRef.current.value = ''
      }
      setData(messageData)
      setMessages(messages => [...messages, messageData.result])
      setInput('')

    }catch(error){
      console.log(error)
    }finally{
      setMessageSending(false)
    }
  }

  useEffect(()=>{
    if(!data) return

    if(selectedConversation.mock){

      setOldMockId(selectedConversation._id)

      setSelectedConversation(conversation => {
        return {
          _id: data?.result.conversationId,
          lastMessage: {
            message: data?.result.message,
            sender: data?.result.sender
          },
          participants: [...conversation.participants]
        }
      })

      return
    }

    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conversation => {
          if(conversation._id === selectedConversation._id){
            return {
              ...conversation,
              lastMessage: {
                message: data?.result.message,
                sender: data?.result.sender
              }
            }
          }

        return conversation
      })
      return updatedConversations
    })

  }, [data])


  useEffect(()=>{
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conversation => {
          if(conversation._id === oldMockId){
            return {
              ...selectedConversation
            }
          }

        return conversation
      })
      return updatedConversations
    })
  }, [oldMockId])

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      handleSendMessage()
    }
  }


  return (
    <Flex direction={'column'} gap={2}>
      <Flex gap={1}>
          <InputGroup>
              <Input ref={inputRef} onKeyDown={handleKeyDown} value={input} onChange={e => setInput(e.target.value)} w={'full'} placeholder="Type a message..." />
              <InputRightElement onClick={handleSendMessage}>
                  <Button isLoading={messageSending} variant={'ghost'}><IoSendSharp cursor={'pointer'} /></Button>
              </InputRightElement>
          </InputGroup>
          <Button onClick={() => {fileRef.current.click()}}>
            <FaImage />
          </Button>
          <Input name='image-file' type='file' hidden ref={fileRef} onChange={handleImgChange} />
      </Flex>
    </Flex>
  )
}
