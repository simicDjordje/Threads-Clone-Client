import { Button } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io"

const GoBackButton = () => {
    const navigate = useNavigate()
  return (
    <Button position={'fixed'} top={'30px'} left={'30px'} size={'sm'}
    onClick={()=>{navigate(-1)}}
    >
        <IoIosArrowBack size={20} />
    </Button>
  )
}

export default GoBackButton