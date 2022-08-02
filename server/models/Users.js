const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  location: Object,
  isPrivate: Boolean,
  showFollowing: Boolean,
  following: Array,
  followers: Array,
  similarityMethod: Number
})

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model('user', userSchema)
