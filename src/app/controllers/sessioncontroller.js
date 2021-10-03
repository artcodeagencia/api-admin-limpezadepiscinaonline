const bcryptUser = require('bcryptjs');
const { Op } = require('sequelize');
const { admin } = require('../models');
const jwtMiddeware = require('jsonwebtoken')
const { promisify } = require('util')

class AdminController {

  async get(req, res) {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401).json({ message: 'Token not provided' })

    const [, token] = authHeader.split(' ')

    try {
      const decoded = await promisify(jwtMiddeware.verify)(token, process.env.APP_SECRET)
      req.userID = decoded.id
      return res.status(200).json({ message: 'Valid' })
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid' })
    }
  }

  async login(req, res) {
    const {
      user, password,
    } = req.body;

    const adminconst = await admin.findOne({
      where: {
        [Op.or]: [
          { usuario: user },
          { email: user },
        ],
      },
    });
    
    if (!adminconst) return res.status(200).json({ title: 'Usuário não encontrado', message: 'Certifique-se que seu usuário esteja correto' });

    const authentication = await bcryptUser.compare(password, adminconst.senha_hash);

    if (!authentication) return res.status(200).json({ title: 'Senha incorreta', message: 'Digite sua senha corretamente' });

    return res.status(200).json({ token: adminconst.generateToken() });
  }
}

module.exports = new AdminController()
