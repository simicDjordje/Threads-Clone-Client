import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useNavigate } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { FiLogOut } from "react-icons/fi"

const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom)
    const navigate = useNavigate()
    const showToast = useShowToast()

    const handleLogout = async () => {
        try{

            const response = await fetch('/api/v1/users/logout', {method: 'POST'})
            const data = await response.json()

            if(data.success){
                localStorage.removeItem('user-info')
                setUser(null)
                navigate('/auth')
                showToast(data.message, 'success', 1000)
            }

        }catch(error){
            console.log(error)
        }
    }

  return (
    <Button position={'fixed'} top={'30px'} right={'30px'} size={'sm'}
        onClick={handleLogout}
    >
        <FiLogOut size={20} />
    </Button>
  )
}

export default LogoutButton