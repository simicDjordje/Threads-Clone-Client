import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
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
import { useNavigate } from 'react-router-dom'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
  
  export default function SignupCard() {
    const [showPassword, setShowPassword] = useState(false)
    const setAuthScreenState = useSetRecoilState(authScreenAtom)
    const setUser = useSetRecoilState(userAtom)
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
      name: '',
      username: '',
      email: '',
      password: ''
    })
    const [validationActive, setValidationActive] = useState(false)
    const navigate = useNavigate()
    const showToast = useShowToast()
    const handleSignUp = async () => {
      setLoading(true)
      try{

        if(!inputs.name || !inputs.username || !inputs.email || !inputs.password){
          showToast('Please complete all required fields', 'error')
          setValidationActive(true)
          return
        }


        const response = await fetch('/api/v1/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
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
              Sign up
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl isRequired={validationActive && !inputs.name ? true : false}>
                    <FormLabel>Full name</FormLabel>
                    <Input value={inputs.name} onChange={(e)=>setInputs({...inputs, name: e.target.value})} type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired={validationActive && !inputs.username ? true : false}>
                    <FormLabel>Username</FormLabel>
                    <Input value={inputs.username} onChange={(e)=>setInputs({...inputs, username: e.target.value})} type="text" />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired={validationActive && !inputs.email ? true : false}>
                <FormLabel>Email address</FormLabel>
                <Input value={inputs.email} onChange={(e)=>setInputs({...inputs, email: e.target.value})} type="email" />
              </FormControl>
              <FormControl isRequired={validationActive && !inputs.password ? true : false}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input value={inputs.password} onChange={(e)=>setInputs({...inputs, password: e.target.value})} type={showPassword ? 'text' : 'password'} />
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
                  onClick={handleSignUp}
                  isLoading={loading}
                 >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link onClick={()=>setAuthScreenState('login')} color={'blue.400'}>Sign in</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }