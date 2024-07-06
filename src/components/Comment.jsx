import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'

const Comment = ({reply, lastReply}) => {


  return (
    <>
        <Flex gap={4} py={2} my={2} w={'full'}>
            <Avatar src={`/photos/profile-photo${reply?.userId}.png`} name={reply?.username} size={'sm'} />
            <Flex gap={1} w='full' flexDirection={'column'}>
                <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={'sm'} fontWeight={'bold'}>{reply?.username}</Text>
                    <Flex gap={2} alignItems={'center'}>
                        {/* <Text fontSize={'sm'} color={'gray.light'}>1d</Text> */}
                        {/* <BsThreeDots /> */}
                    </Flex>
                </Flex>

                <Text>{reply?.text}</Text>

                {/* <Actions />

                <Text fontSize={'sm'} color={'gray.light'}>67 likes</Text> */}
            </Flex>
        </Flex>
        {!lastReply && <Divider my={4} />}
    </>
  )
}

export default Comment