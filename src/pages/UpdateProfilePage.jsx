import {useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import usePreviewImage from '../hooks/usePreviewImage'
import useShowToast from '../hooks/useShowToast'

const UpdateProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom)
    const [validationActive, setValidationActive] = useState(false)
    const fileRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        password: '',
    })
    const {handleImgChange, imgUrl} = usePreviewImage()
    const showToast = useShowToast()
    const navigate = useNavigate()

    const handleUpdate = async () => {
      setLoading(true)
      try{
        if(!inputs.name || !inputs.username || !inputs.email){
          setValidationActive(true)
          showToast('Some of the fields are required', 'error')
          return
        }

        const formData = new FormData()
        if(imgUrl) formData.append('profile-photo', fileRef.current.files[0])

        formData.append('name', inputs.name)
        formData.append('username', inputs.username)
        formData.append('email', inputs.email)
        formData.append('bio', inputs.bio)
        
        if(inputs.password) formData.append('password', inputs.password)

        const response = await fetch('/api/v1/users/update', {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        if(!data.success){
          showToast(data.message, 'error')
          return
        }

        showToast(data.message, 'success')
        localStorage.setItem('user-info', JSON.stringify(data.result))
        setUser(data.result)
        navigate('/')
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false)
      }
    }

    return (
    <Flex
      align={'center'}
      justify={'center'}
      my={6}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src={imgUrl || `http://localhost:5000/photos/profile-photo${user._id}.png`} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={()=>fileRef.current.click()}>Change Avatar</Button>
              <Input name='profile-photo' type='file' hidden ref={fileRef} onChange={handleImgChange} />
            </Center>
          </Stack>
        </FormControl>
        <FormControl isRequired={validationActive && !inputs.name ? true : false}>
          <FormLabel>Full name</FormLabel>
          <Input
            value={inputs.name}
            placeholder="John Doe"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={e => setInputs({...inputs, name: e.target.value})}
          />
        </FormControl>
        <FormControl isRequired={validationActive && !inputs.username ? true : false}>
          <FormLabel>User name</FormLabel>
          <Input
            value={inputs.username}
            placeholder="johndoe123"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={e => setInputs({...inputs, username: e.target.value})}
          />
        </FormControl>
        <FormControl isRequired={validationActive && !inputs.email ? true : false}>
          <FormLabel>Email address</FormLabel>
          <Input
            value={inputs.email}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            onChange={e => setInputs({...inputs, email: e.target.value})}
          />
        </FormControl>
        <FormControl isRequired={validationActive && !inputs.bio ? true : false}>
          <FormLabel>Bio</FormLabel>
          <Input
            value={inputs.bio}
            placeholder="bio"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            onChange={e => setInputs({...inputs, bio: e.target.value})}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
            onChange={e => setInputs({...inputs, password: e.target.value})}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            onClick={handleUpdate}
            isLoading={loading}
            >
            Update
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}


export default UpdateProfilePage