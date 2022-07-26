import { toast } from 'react-toastify'

export const notifySuccess = (successMessage) => {
  toast.success(successMessage, {
    position: 'bottom-center',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined
  })
}

export const notifyError = (errorMessage) => {
  toast.error(errorMessage, {
    position: 'bottom-center',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined
  })
}
