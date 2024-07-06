import {useState} from 'react'
import { 
    Avatar, 
    Box, 
    Flex, 
    Image, 
    Text,
    } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Actions from './Actions'
import {formatDistanceToNow} from 'date-fns'
import useGetUserProfile from '../hooks/useGetUserProfile'
import DeletePostButton from './DeletePostButton'

const Post = ({post, currentUser}) => {
    const {userData: user} = useGetUserProfile(post?.postedBy)
    const navigate = useNavigate()

    
    if(!user) return null

  return (
        <Flex gap={3} mb={4} py={5} cursor={'pointer'}>
            <Flex flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'}>
                <Avatar size={'md'} name={user?.name} src={`/photos/profile-photo${user?._id}.png`}
                    onClick={() => {
                        navigate(`/${user?.username}`)
                    }}
                />
                <Box w={0.5} h={'full'} bg={'gray.light'} my={2}></Box>
                <Flex flexDirection={'column'}>
                    {!post?.replies.length && <Text>🥱</Text>}
                    <Flex justifyContent={'space-between'}>
                        {post.replies[0] && 
                            <Avatar size={'2xs'} name={post?.replies[0].username} src={`/photos/profile-photo${post?.replies[0].userId}.png`} />
                        }

                        {post.replies[1] && 
                            <Avatar size={'sm'} name={post?.replies[1].username} src={`/photos/profile-photo${post?.replies[1].userId}.png`} />
                        }
                    </Flex>
                    <Flex justifyContent={'center'} mt={2}>
                        {post.replies[2] && 
                            <Avatar size={'xs'} name={post?.replies[2].username} src={`/photos/profile-photo${post?.replies[2].userId}.png`} />
                        }
                    </Flex>
                </Flex>
            </Flex>
            <Flex flex={1} flexDirection={'column'} gap={2}>
                <Flex justifyContent={'space-between'}>
                    <Flex w={'full'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}
                        onClick={() => {
                            navigate(`/${user?.username}`)
                        }}
                        >{user?.username}</Text>
                        <Image src='/verified.png' w={4} h={4} ml={1} />
                    </Flex>
                    <Flex alignItems={'center'} gap={4}>
                        <Text fontSize={'sm'} w={40} textAlign={'right'} color={'gray.light'}>{formatDistanceToNow(new Date(post.createdAt))}</Text>
                        {currentUser && currentUser?._id === user?._id && 
                            <DeletePostButton post={post} />
                        }
                    </Flex>
                </Flex>

                <Text onClick={() => navigate(`/${user?.username}/post/${post._id}`)} fontSize={'sm'}>{post.text}</Text>
                {post.photoId !== 'none' &&
                <Box onClick={() => navigate(`/${user?.username}/post/${post._id}`)} borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                    <Image src={`/photos/post-photo${post.photoId}.png`} w={'full'} />
                </Box>
                 }
                <Flex gap={3} my={2}>
                    <Actions post={post} />
                </Flex>
            </Flex>
        </Flex>
  )
}

export default Post