import axios from 'axios'

export default class Image {
  uploadImage = async (e, refresh, setRefresh) => {
    const file = e.target.files[0]
    const base64 = await this.convertBase64(file)
    await this.addProfilePicture(base64)
    setRefresh(!refresh)
  }

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  addProfilePicture = (base64) => {
    return axios.post('/image', {
      base64
    }, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
  }

  getProfilePicture = () => {
    return axios.get('/image', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
  }

  getUserProfilePicture = (userId) => {
    return axios.get('/image/user', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'user-id': userId
      }
    })
  }
}
