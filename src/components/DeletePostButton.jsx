import { useState } from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    useColorModeValue
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../atoms/postsAtom'
import { useRecoilState } from 'recoil'

const DeletePostButton = ({post}) => {
    const showToast = useShowToast()
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [posts, setPosts] = useRecoilState(postsAtom)

    const handleDeletePost = async (e) => {
        setDeleteLoading(true)
        e.preventDefault()
        try{
            const response = await fetch(`/api/v1/posts/${post?._id}`, {method: 'DELETE'})
            const data = await response.json()

            if(!data.success){
                showToast(data.message, 'error')
                return
            }

            showToast(data.message, 'success')

            setPosts(posts.filter(postIter => postIter._id !== post._id))

        }catch(error){
            console.log(error)
        }finally{
            setDeleteLoading(false)
        }
    }

  return (
    <Popover>
        <PopoverTrigger>
            <Button size={'sm'} variant={'ghost'}><DeleteIcon size={20} /></Button>
        </PopoverTrigger>
        <PopoverContent bg={useColorModeValue('gray.300', 'gray.dark')}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>Are you sure you want to delete this post?</PopoverBody>
            <PopoverFooter display='flex' justifyContent={'end'}>
                <Button id='popover-footer-delete-btn' isLoading={deleteLoading} colorScheme='red' onClick={handleDeletePost}>Delete</Button>
            </PopoverFooter>
        </PopoverContent>
    </Popover>
  )
}

export default DeletePostButton