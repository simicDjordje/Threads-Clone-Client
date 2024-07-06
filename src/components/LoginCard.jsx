import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
import { useNavigate } from 'react-router-dom'

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreenState = useSetRecoilState(authScreenAtom)
  const setUser = useSetRecoilState(userAtom)
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  })
  const [validationActive, setValidationActive] = useState(false)
  const showToast = useShowToast()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    try{
      if(!inputs.username || !inputs.password){
        showToast('Please fill out all required fields', 'error')
        setValidationActive(true)
        return
      }

      const response = await fetch('/api/v1/users/login', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(inputs)
      })
      const data = await response.json()

      if(!data.success){
        showToast(data.message, 'error')
        return
      }

      localStorage.setItem('user-info', JSON.stringify(data.result))
      setUser(data.result)
      navigate('/')
      showToast(data.message, 'success', 1000)
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
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign in
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: 'full',
            sm: '400px'
          }}
          >
          <Stack spacing={4}>
            <FormControl isRequired={validationActive && !inputs.username ? true : false}>
              <FormLabel>Username</FormLabel>
              <Input onChange={(e)=>setInputs({...inputs, username: e.target.value})} type="text" />
            </FormControl>
            <FormControl isRequired={validationActive && !inputs.password ? true : false}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input onChange={(e)=>setInputs({...inputs, password: e.target.value})} type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800'),
                }}
                onClick={handleLogin}
                isLoading={loading}
               >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link onClick={()=>setAuthScreenState('signup')} color={'blue.400'}>Create one</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}