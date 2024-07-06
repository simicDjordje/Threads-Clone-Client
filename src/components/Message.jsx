import { Avatar, Flex, Text, Box, Image, Tooltip } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { motion } from "framer-motion"

const Message = ({ownMessage, message}) => {
  const currentUser = useRecoilValue(userAtom)
  console.log(message.message)
  console.log(message)
  return ownMessage ? (
    <Flex
    alignSelf={'flex-end'}
    direction={'column'}
    >   
      <Box cursor={'pointer'} as={motion.div} initial={{x: -100}} animate={{x: 0}}>
        <Flex direction={'row'} justifyContent={'space-between'} maxW={'250px'} gap={1}>
          <Flex direction={'column'} bg={'blue.400'} borderRadius={'md'} p={1}>
            <Text>{message.message || ''}</Text>
            {message.hasOwnProperty('photoId') && message.photoId !== 'none' && 
              <Tooltip label='See full image'>
                <Box onClick={()=>{window.open(`/photos/message-photo${message.photoId}.png`)}} as={motion.div} whileHover={{ scale: 1.02 }}>
                  <Image borderRadius={6} src={`/photos/message-photo${message.photoId}.png`} />
                </Box>
              </Tooltip>
            }
          </Flex>

          <Avatar w={7} h={7} src={`/photos/profile-photo${currentUser._id}.png`} />
        </Flex>
      </Box>

      <Flex direction={'row'} justifyContent={'flex-end'} pr={10}>
        <Text color={'gray.300'} fontSize={'10px'}>{!message.seen ? 'sent' : 'seen'}</Text>
      </Flex>
    </Flex>
  ) : (
    <Flex
    gap={2}
    alignSelf={'flex-start'}
    >
      <Box cursor={'pointer'} as={motion.div} initial={{x: 100}} animate={{x: 0}}>
        <Flex direction={'row'} justifyContent={'space-between'} maxW={'250px'} gap={1}>
          <Avatar w={7} h={7} src={`/photos/profile-photo${message.sender}.png`} />
          <Flex direction={'column'} bg={'gray.700'} borderRadius={'md'} p={1}>
            <Text>{message.message || ''}</Text>
            {message.photoId !== 'none' && 
              <Tooltip label='See full image'>
                <Box onClick={()=>{window.open(`/photos/message-photo${message.photoId}.png`)}} as={motion.div} whileHover={{ scale: 1.02 }}>
                  <Image borderRadius={6} src={`/photos/message-photo${message.photoId}.png`} />
                </Box>
              </Tooltip>
            }
          </Flex>
        </Flex>
      </Box>
      {/* <Avatar w={7} h={7} src={`/photos/profile-photo${message.sender}.png`} />
      <Text maxW={'200px'} bg={'gray.400'} p={1} borderRadius={'md'} color={'black'}>{message.message}</Text> */}
    </Flex>
  )
}

export default Message