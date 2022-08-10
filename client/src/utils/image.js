import axios from 'axios'

export default class Image {
  static uploadProfileImage = async (e, refresh, setRefresh) => {
    const file = e.target.files[0]
    const base64 = await Image.convertBase64(file)
    await Image.addProfilePicture(base64)
    setRefresh(!refresh)
  }

  static uploadBackgroundImage = async (e, refresh, setRefresh) => {
    const file = e.target.files[0]
    const base64 = await Image.convertBase64(file)
    await Image.addBackgroundPicture(base64)
    setRefresh(!refresh)
  }

  static convertBase64 = (file) => {
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

  static addProfilePicture = (base64) => {
    return axios.post('/image', {
      base64
    }, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
  }

  static addBackgroundPicture = (base64) => {
    return axios.post('/image/background', {
      base64
    }, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
  }

  static getProfilePicture = () => {
    return axios.get('/image', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
  }

  static getBackgroundPicture = () => {
    return axios.get('/image/background', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
  }

  static getUserProfilePicture = (userId) => {
    return axios.get('/image/user', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'user-id': userId
      }
    })
  }
}
