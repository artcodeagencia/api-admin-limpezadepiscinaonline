
const bcryptUser = require('bcryptjs');
const { Op } = require('sequelize');
const { admin } = require('../models');
const jwtMiddeware = require('jsonwebtoken')
const { promisify } = require('util')
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

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
  
  async adminForgotPassword(req, res){
    const {
      user
    } = req.body;

    const adminconst = await admin.findOne({
      where: {
        [Op.or]: [
          { usuario: user },
          { email: user },
        ],
      },
    });

    if (!adminconst) return res.status(200).json({ erro: 1, title: 'Usuário ou e-mail não cadastrado', message: 'Certifique-se que seu usuário ou e-mail esteja correto' });

     // New Mail
     const hash = randomstring.generate();
     const email = adminconst.email;

     await admin.update(
       { forgot_password_hash: hash },
       { where: { email: email} }
     )

    // create reusable transporter object using the default SMTP transport
  
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        },
    });

    let dataSend = {
        from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `Redefinição de e-mail administrador`,
        html: `<p style='margin:0 auto; color: black; padding-bottom: 30px'><b style='display:table; width: 100%; text-align:center'>Para continuar com a redefinição de senha, clique no link abaixo:</b></p><a href='${process.env.APP_DOMAIN}/admin/redefinicao-de-senha/?hash=${hash}' target='_blank' style='color: #FFFFFF; text-decoration: none;'><p style='background: #43359B; padding: 20px 0; color: #FFFFFF; border-radius: 10px; text-align: center; font-weight: 700; cursor: pointer;'>Clique aqui</p></a>`
    };

    await transporter.sendMail(dataSend);

    return res.status(200).json({ erro: 0, title: 'Envio da redefinição realizada', message: 'Foi enviado para o seu e-mail administrativo, um e-mail para esta validação.' });
  }

  async adminRedefinePassword(req, res){
    const {
      hash,
      password1
    } = req.body;

    const values = {
      // forgot_password_hash: null,
      senha_hash: await bcryptUser.hash(password1, 9)
    }

    await admin.update(values,
      { where: { forgot_password_hash: hash} }
    )

    return res.status(200).json({ erro: 0, title: 'Senha Redefinida', message: 'A sua senha foi redefinida com sucesso. Agora, já pode-se logar no painel administrativo.' });
  }

  async authHash(req, res){
    const {
      hash
    } = req.body;


    console.log(hash);

    const adminconst = await admin.findOne({
      where: { forgot_password_hash: hash},
    });

    let body = null;
    if(adminconst !== null) body = true ; else body = false;
    res.status(200).json({ body });
  }
}

module.exports = new AdminController()
