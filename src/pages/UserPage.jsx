import { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import Post from '../components/Post'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'
import useGetUserProfile from '../hooks/useGetUserProfile'

const UserPage = () => {
  const currentUser = useRecoilValue(userAtom)
  const {username} = useParams()
  const {userData: user, fetchingUser: loading} = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast()
  const [fetchingPosts, setFetchingPosts] = useState(true)

  useEffect(()=>{
    const getPosts = async () => {
      try{

        const response = await fetch(`/api/v1/posts/user/${username}`)
        const data = await response.json()

        if(!data.success){
          return
        }

        setPosts(data.result)

      }catch(error){
        console.log(error)
      }finally{
        setFetchingPosts(false)
      }
    }

    getPosts()
  }, [username, showToast])

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

  return (
    <>
      <UserHeader user={user} />

      {fetchingPosts && 
        <Flex justifyContent="center" mt={32}>
          <Spinner size={'xl'} />
        </Flex>
      }


      {!fetchingPosts && !posts.length && 
        <Flex justifyContent="center" mt={32}>
          <Text fontSize={'lg'} >{currentUser && currentUser._id === user._id ? 'You have' : 'User has'} no posts</Text>
        </Flex>
      }

      {posts.map((post, index) => (
        <Post key={index} post={post} currentUser={currentUser} />
      ))}
    </>
  )
}

export default UserPage