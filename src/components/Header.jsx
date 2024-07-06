import { Flex, Image, useColorMode } from '@chakra-ui/react'
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom'
import {Link} from 'react-router-dom'
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { BsFillChatQuoteFill } from "react-icons/bs"

const Header = () => {
    const currentUser = useRecoilValue(userAtom)
    const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Flex justifyContent={currentUser ? 'space-between' : 'center'} mt={6} mb={12}>
        {currentUser && 
        <Link to={'/'}>
          <AiFillHome size={24} />
        </Link>}

        <Image
            cursor={'pointer'}
            alt='logo'
            w={6}
            src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
            onClick={toggleColorMode}
        />

          {currentUser && 
          <Flex justifyContent={'space-between'} gap={5}>
            <Link to={`/chat`}>
              <BsFillChatQuoteFill size={20} />
            </Link>
            <Link to={`/${currentUser.username}`}>
              <RxAvatar size={24} />
            </Link>
          </Flex>
          }

    </Flex>
  )
}

export default Header