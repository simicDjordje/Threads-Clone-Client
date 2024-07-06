import {useState} from 'react'
import { Avatar, Box, Flex, Text, VStack, Menu, MenuButton, Portal, MenuList, MenuItem, Button, Image } from '@chakra-ui/react'
import {BsInstagram} from 'react-icons/bs'
import {CgMoreO} from 'react-icons/cg'
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link, useNavigate } from 'react-router-dom'

const UserHeader = ({user}) => {
    const showToast = useShowToast()
    const currentUser = useRecoilValue(userAtom)
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id) || false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const copyURL = () => {
        navigator.clipboard.writeText(window.location.href).then(()=>{
            showToast('Profile link copied', 'success', 1000)
        })
    }

    const handleFollowUnfollow = async () => {
        setLoading(true)
        try{
            if(!currentUser) navigate('/auth')

            const response = await fetch(`/api/v1/users/${following ? 'unfollow' : 'follow'}/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()

            if(!data.success){
                showToast(data.message, 'error')
                setLoading(false)
                return
            }

            setFollowing(!following)
            setLoading(false)
        }catch(error){
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <VStack gap={4} alignItems={'start'}>
        <Flex justifyContent={'space-between'} w="full">
            <Box>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                        {user.name}
                    </Text>
                    {/* <Image src='/verified.png' w={4} h={4} ml={1} /> */}
                </Flex>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'sm'}>{user.username}</Text>
                    <Text bg={'gray.dark'} color={'gray.light'} fontSize={'xs'} p={1} borderRadius={'full'}>threads.net</Text>
                </Flex>
            </Box>
            <Box>
                <Avatar
                    name={user.name}
                    src={`/photos/profile-photo${user._id}.png`}
                    size={{
                        base: 'md',
                        md: 'lg'
                    }}
                />
            </Box>
        </Flex>

        <Text>
            {user.bio}
        </Text>
        {currentUser?._id === user._id ? (
            <Link to={'/update'}>
                <Button size={'sm'}>
                    Update profile
                </Button>
            </Link>
        ) : (
            <Button isLoading={loading} size={'sm'} onClick={handleFollowUnfollow}>{following ? 'Unfollow' : 'Follow'}</Button>
        )}
        <Flex w={'full'} justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
                <Text color={'gray.light'}>3.2K followers</Text>
                <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box>
                <Link color={'gray.light'}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size={25} cursor={'pointer'} />
                </Box>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton><CgMoreO size={25} cursor={'pointer'} /></MenuButton>
                        <Portal>
                            <MenuList bg={'gray.dark'}>
                                <MenuItem bg={'gray.dark'} onClick={copyURL}>Copy link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>

        <Flex w={'full'}>
            <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={3} cursor={'pointer'}>
                <Text fontWeight={'bold'}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={'1px solid gray'} justifyContent={'center'} color={'gray.light'} pb={3} cursor={'pointer'}>
                <Text fontWeight={'bold'}>Replies</Text>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader