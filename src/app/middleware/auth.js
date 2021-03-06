const jwtMiddeware = require('jsonwebtoken')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ message: 'Token not provided' })

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwtMiddeware.verify)(token, process.env.APP_SECRET)
    req.userID = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' })
  }
}