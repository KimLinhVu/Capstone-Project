const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    res.send('We need a token')
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(401).send()
      } else {
        req.userId = user.id
        next()
      }
    })
  }
}

exports.verifyJWT = verifyJWT
