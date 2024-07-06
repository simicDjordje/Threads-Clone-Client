import {Link} from 'react-router-dom'
import {Flex, Button, Spinner, Text} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const HomePage = () => {
  //const [posts, setPosts] = useState(null)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [loading, setLoading] = useState(true)
  const showToast = useShowToast()

  useEffect(() => {
    const getFeedPosts = async () => {
      try{
        const response = await fetch('/api/v1/posts/feed')
        const data = await response.json()

        if(!data.success){
          showToast(data.message, 'error')
          return
        }

        setPosts(data.result)
        
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false)
      }
    }

    getFeedPosts()
  }, [showToast])

  return (
    <>
      {loading && !posts && 
        <Flex justifyContent={'center'} mt={64}>
          <Spinner size={'xl'} />
        </Flex>
      }

      {!posts && !loading && 
        <Flex justifyContent={'center'} mt={64}>
          <Text fontSize={'xl'}>Follow some users to see the feed</Text>
        </Flex>
      }

      {posts && posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}

    </>
  )
}

export default HomePage