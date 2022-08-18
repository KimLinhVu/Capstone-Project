const axios = require('axios')
require('dotenv').config()

const getTrackDetails = (trackSearchParams) => {
  const uri = encodeURI(`https://shazam.p.rapidapi.com/search?term=${trackSearchParams}&locale=en-US&offset=0&limit=1`)
  return axios.get(uri, {
    headers: {
      'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
  })
}

exports.getTrackDetails = getTrackDetails
