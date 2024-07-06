import { Avatar, AvatarBadge, Flex, useColorModeValue, Text, Image } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { BsCheck2All } from "react-icons/bs"
import { selectedConversationAtom } from "../atoms/messagesAtom"

const Conversations = ({conversation, isOnline}) => {
    const currentUser = useRecoilValue(userAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const lastMessage = conversation.lastMessage.message?.length > 15 ? `${conversation.lastMessage?.message.substring(0, 15)}...` : conversation.lastMessage.message
    
  return (
    <Flex
    gap={4}
    alignItems={'center'}
    p={1}
    _hover={{
        cursor: 'pointer',
        bg: useColorModeValue('gray.500', 'gray.700'),
        color: 'white'
    }}
    borderRadius={'md'}
    bg={selectedConversation && selectedConversation?._id === conversation._id ? useColorModeValue('gray.600', 'gray.dark') : ''}
    onClick={()=>{setSelectedConversation(conversation)}}
    >
        
        <Avatar size={{
            base: 'xs',
            sm: 'sm',
            md: 'md'
        }} src={`/photos/profile-photo${conversation?.participants[0]._id}.png`}>
            {isOnline && <AvatarBadge boxSize={'1em'} bg={'green.500'} />}
        </Avatar>
        
        <Flex flexDirection={'column'}>
            <Text fontWeight="bold" display={'flex'} alignItems={'center'}>
                {conversation.participants[0].username}
                <Image src="/verified.png" w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={2}>
                {currentUser._id === conversation.lastMessage.sender ? <BsCheck2All color={conversation.lastMessage.seen ? "#4267B2" : ""} size={16} /> : ""}
                {lastMessage}
            </Text>
        </Flex>
    </Flex>
  )
}

export default Conversations