import { Avatar, Flex, Text, Image, Box, Divider, Button, Spinner } from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useNavigate, useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import {formatDistanceToNow} from 'date-fns'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import DeletePostButton from '../components/DeletePostButton'

const PostPage = () => {
  const currentUser = useRecoilValue(userAtom)
  const {userData: user, fetchingUser: loading} = useGetUserProfile()
  const {pid} = useParams()
  const [post, setPost] = useState(null)
  const showToast = useShowToast()
  const [deleted, setDeleted] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    const getPost = async () => {
      try{
        const response = await fetch(`/api/v1/posts/${pid}`)
        const data = await response.json()

        if(!data.success){
          showToast(data.message, 'error')
          return
      }

      setPost(data.result)

      }catch(error){
        console.log(error)
      }
    }

    getPost()
  }, [pid, showToast])

  useEffect(()=>{
      if(deleted){
        navigate(`/${currentUser?.username}`)
      }
  }, [deleted, navigate, currentUser])

  if(!user && loading){
    return(
      <Flex justifyContent="center" mt={64}>
          <Spinner size={'xl'} />
      </Flex>
    )
  }

  if(!user && !loading){
    return (
      <Flex justifyContent="center" mt={64}>
          <Text fontSize={'xl'} >User not found</Text>
      </Flex>
    )
  }

  if(user && !loading && !post){
    return (
      <Flex justifyContent="center" mt={64}>
          <Text fontSize={'xl'} >Post not found</Text>
      </Flex>
    )
  }


  return (
    <>
      <Flex>

        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={`/photos/profile-photo${user._id}.png`} size={'md'} name={user.name} />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
            <Image src={'/verified.png'} w={4} h={4} ml={2} mt={1} />
          </Flex>
        </Flex>

        <Flex gap={4} justifyContent={'end'} alignItems={'center'} w={'250px'}>
          <Text fontSize={'sm'} color={'gray.light'}>{formatDistanceToNow(new Date(post?.createdAt))}</Text>
          {currentUser && currentUser?._id === user?._id && 
              <DeletePostButton post={post} setDeleted={setDeleted} />
          }
        </Flex>

      </Flex>

      <Text my={3}>{post?.text}</Text>

      {post?.photoId !== 'none' && 
        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
            <Image src={`/photos/post-photo${post?.photoId}.png`} w={'full'} />
        </Box>
      }


      <Flex gap={3} my={2} cursor={'pointer'}>
          <Actions post={post} setPost={setPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👏</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      {post?.replies.map((reply, index) => (
        <Comment reply={reply} key={index} lastReply={reply._id === post.replies[post.replies.length - 1]._id} />
      ))}
    </>
  )
}

export default PostPage