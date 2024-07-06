import { AddIcon } from '@chakra-ui/icons'
import { v4 as uuidv4 } from 'uuid'
import {
    Button, 
    useColorModeValue, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Textarea,
    Text,
    Input,
    Flex,
    Image,
    CloseButton,
  } from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'
import usePreviewImage from '../hooks/usePreviewImage'
import { BsImageFill } from 'react-icons/bs'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'


const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [text, setText] = useState('')
    const fileRef = useRef()
    const {handleImgChange, imgUrl, setImgUrl} = usePreviewImage()
    const showToast = useShowToast()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useRecoilState(postsAtom)

    useEffect(()=>{
      setImgUrl(null)
    },[])

    const handleText = (e) => {
        setText(e.target.value)
    }

    const handleImageClose = () => {
        setImgUrl(null)
        fileRef.current.value = ''
    }

    const handlePost = async () => {
      setLoading(true)
      try{
        if(!text){
          showToast('Post text is required', 'error')
          setLoading(false)
          return
        }

        const formData = new FormData()
        formData.append('text', text.length > 500 ? text.slice(0, 500) : text)
        formData.append('photoId', imgUrl ? `${uuidv4()}${Math.random()}` : 'none')
        formData.append('post-photo', fileRef.current.files[0])
        
        const response = await fetch('/api/v1/posts/create', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if(!data.success){
          showToast(data.message, 'error')
          setLoading(false)
          return
        }

        //showToast(data.message, 'success')
        onClose()
        setLoading(false)
        setImgUrl(null)
        setPosts([data.result, ...posts])

      }catch(error){
        console.log(error)
        setLoading(false)
      }
    }

  return (
    <>
        <Button 
            position={'fixed'} 
            bottom={10} 
            right={10}
            leftIcon={<AddIcon />}
            onClick={onOpen}
            bg={useColorModeValue('gray.300', 'gray.dark')}
        >
            Create Post
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue('gray.300', 'gray.dark')}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
                <FormControl>
                    <Textarea onChange={handleText} placeholder='Post content goes here' />
                    <Text fontSize={'xs'} fontWeight={'semibold'} textAlign={'right'} m={1} color={text.length > 500 ? 'red' : ''}>{text.length}/500</Text>
                    <Input name='post-photo' type='file' hidden ref={fileRef} onChange={handleImgChange} />
                    <BsImageFill style={{marginLeft: '5px', cursor: 'pointer'}} size={16} onClick={()=>{fileRef.current.click()}} />
                </FormControl>
                {imgUrl && 
                    <Flex transition={'ease-in-out'} w={'full'} mt={5} position={'relative'}>
                        <Image src={imgUrl} alt='Selected img' />
                        <CloseButton onClick={handleImageClose} bg={'gray.800'} position={'absolute'} top={2} right={2} />
                    </Flex>}
          </ModalBody>
          <ModalFooter>
            <Button isLoading={loading} onClick={handlePost} colorScheme='blue'>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost