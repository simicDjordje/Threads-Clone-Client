import { 
    Flex, 
    Box, 
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useColorModeValue,
    Textarea
 } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {useRecoilState, useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from "../hooks/useShowToast"
import postsAtom from "../atoms/postsAtom"

const Actions = ({post}) => {
    const user = useRecoilValue(userAtom)
    const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false)
    const [likesCount, setLikesCount] = useState(post?.likes.length)
    const [isLiking, setIsLiking] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [reply, setReply] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()
    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)

    const handleLikeUnlike = async () => {
        if(isLiking)return
        try{
            if(!user){
                navigate('/auth')
            }
            setIsLiking(true)
            const response = await fetch(`/api/v1/posts/${liked ? 'unlike' : 'like'}/${post?._id}`, {method: 'PUT'})
            const data = await response.json()

            if(!data.success){
                showToast(data.message, 'error')
                return
            }

            // setLikesCount(liked ? likesCount - 1 : likesCount + 1)

            setPosts(posts.map(postIter => {
                if(postIter._id === post._id){
                    return {
                        ...postIter,
                        likes: !liked ? [...postIter.likes, user._id] : postIter.likes.filter(likeId => likeId !== user._id)
                    }
                }

                return postIter
            }))


            setLiked(!liked)
        }catch(error){
            console.log(error)
        }finally{
            setIsLiking(false)
        }
    }

    const handleReply = async () => {
        try{
            setIsReplying(true)

            if(!reply){
                showToast('Reply text is empty', 'error')
                return
            }

            const response = await fetch(`/api/v1/posts/reply/${post?._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: reply
                })
            })

            const data = await response.json()

            if(!data.success){
                showToast(data.message, 'error')
                return
            }

            setPosts(posts.map(postIter => {
                if(postIter._id === post._id){
                    return {
                        ...postIter,
                        replies: [...postIter.replies, data.result]
                    }
                }

                return postIter
            }))
            onClose()
            setReply('')
        }catch(error){
            console.log(error)
        }finally{
            setIsReplying(false)
        }
    }

  return (
    <Flex direction={'column'}>
        <Flex onClick={e => e.preventDefault()}>
            <Button variant={'ghost'} size={'sm'}><LikedSVG liked={liked} handleLikeUnlike={handleLikeUnlike} /></Button>
            <Button variant={'ghost'} size={'sm'}><CommentSVG onOpen={onOpen} /></Button>
            <Button variant={'ghost'} size={'sm'}><RepostSVG /></Button>
            <Button variant={'ghost'} size={'sm'}><ShareSVG /></Button>
        </Flex>

        <Flex gap={2} alignItems={'center'} mt={4}>
            <Text color={'gray.light'} fontSize={'sm'}>{post?.replies.length} replies</Text>
                <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
            <Text color={'gray.light'} fontSize={'sm'}>{post?.likes.length} likes</Text>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={useColorModeValue('gray.300', 'gray.dark')}>
            <ModalHeader>What you have to say?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Textarea 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    mt={5} 
                    type="text" 
                    placeholder="Reply goes here..." />
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleReply} isLoading={isReplying} colorScheme='blue'>Reply</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </Flex>
  )
}

export default Actions



const LikedSVG = ({liked, handleLikeUnlike}) => {
    return (
        <svg
					aria-label='Like'
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeUnlike}
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>
    )
}

const CommentSVG = ({onOpen}) => {
    return (
        <svg
					aria-label='Reply'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onOpen}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>
    )
}


const RepostSVG = () => {
    return (
        <svg
                    aria-label='Repost'
                    color='currentColor'
                    fill='currentColor'
                    height='20'
                    role='img'
                    viewBox='0 0 24 24'
                    width='20'
                >
                    <title>Repost</title>
                    <path
                        fill=''
                        d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
                    ></path>
                </svg>
    )
}

const ShareSVG = () => {
    return (
        <svg
                    aria-label='Share'
                    color=''
                    fill='rgb(243, 245, 247)'
                    height='20'
                    role='img'
                    viewBox='0 0 24 24'
                    width='20'
                >
                    <title>Share</title>
                    <line
                        fill='none'
                        stroke='currentColor'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        x1='22'
                        x2='9.218'
                        y1='3'
                        y2='10.083'
                    ></line>
                    <polygon
                        fill='none'
                        points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
                        stroke='currentColor'
                        strokeLinejoin='round'
                        strokeWidth='2'
                    ></polygon>
                </svg>
    )
}