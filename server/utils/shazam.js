const axios = require('axios')

const getTrackDetails = (trackSearchParams) => {
  const uri = encodeURI(`https://shazam.p.rapidapi.com/search?term=${trackSearchParams}&locale=en-US&offset=0&limit=1`)
  return axios.get(uri, {
    headers: {
      'X-RapidAPI-Key': '1731bc1cc2mshbe69949fd2ac43cp1db541jsncfade678c239',
      'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
  })
}

exports.getTrackDetails = getTrackDetails
