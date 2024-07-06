import { useEffect, useState } from "react"
import useShowToast from "./useShowToast"
import { useParams } from "react-router-dom"

const useGetUserProfile = (queryParam) => {
    const [userData, setUserData] = useState(null)
    const [fetchingUser, setFetchingUser] = useState(true)
    const showToast = useShowToast()
    const {username} = useParams()

    useEffect(()=>{

        const fetchUser = async () => {
            try{
                const response = await fetch(`/api/v1/users/profile/${!queryParam ? username : queryParam}`)
                const data = await response.json()

                if(!data.success){
                    showToast(data.message, 'error')
                    return
                }

                setUserData(data.result)
            }catch(error){
                console.log(error)
                showToast(error.message, 'error')
            }finally{
                setFetchingUser(false)
            }
        }

        fetchUser()
    }, [showToast, queryParam, username])


    return {userData, fetchingUser}
}

export default useGetUserProfile