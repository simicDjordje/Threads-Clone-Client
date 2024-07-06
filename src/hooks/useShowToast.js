import { useCallback } from "react";
import { toast } from "react-toastify"

const useShowToast = () => {
    const showToast = useCallback((message, status, autoClose) => {
        toast.dismiss()
        toast[status](message, {
            position: "bottom-center",
            autoClose: autoClose || 2500,
            hideProgressBar: false,
            status,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          });
    }, [])

  return showToast
}

export default useShowToast