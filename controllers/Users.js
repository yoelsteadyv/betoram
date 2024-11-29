import Users from "../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Op } from "sequelize";



export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['username', 'ign', 'email', 'codeLand', 'levelBuff', 'buffName', 'secLevelBuff', 'secBuffName']
    })
    res.json(users)
  } catch (error) {
    console.log(error);

  }
}

export const Register = async (req, res) => {
  const { username, ign, email, codeLand, levelBuff, buffName, password, confPassword } = req.body
  if (password !== confPassword) return res.status(400).json({
    msg: "Password dan Confirm Password tidak cocok"
  })

  // Validasi username
  const existingUsername = await Users.findOne({
    where: { username },
  });
  if (existingUsername) {
    return res.status(400).json({
      msg: "Username sudah terdaftar",
    });
  }

  // Validasi IGN
  const existingIGN = await Users.findOne({
    where: { ign },
  });
  if (existingIGN) {
    return res.status(400).json({
      msg: "IGN sudah terdaftar",
    });
  }

  // Validasi email
  const existingEmail = await Users.findOne({
    where: { email },
  });
  if (existingEmail) {
    return res.status(400).json({
      msg: "Email sudah terdaftar",
    });
  }

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await Users.create({
      username,
      ign,
      email,
      password: hashPassword
    })
    res.json({
      msg: "Register Berhasil"
    })
  } catch (error) {
    console.log(error);

  }
}

// export const Login = async (req, res) => {
//   try {
//     let user;
//     if (req.body.username) {
//       user = await Users.findOne({
//         where: {
//           username: req.body.username
//         }
//       });
//     } else if (req.body.email) {
//       user = await Users.findOne({
//         where: {
//           email: req.body.email
//         }
//       });
//     }
//     if (!user) return res.status(404).json({
//       msg: "User tidak ditemukan"
//     });
//     const match = await bcrypt.compare(req.body.password, user.password);
//     if (!match) return res.status(400).json({
//       msg: "Password Salah"
//     });
//     const userId = user.id;
//     const username = user.username;
//     const email = user.email;
//     const accessToken = jwt.sign({ userId, username, email }, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: '20s'
//     });
//     const refreshToken = jwt.sign({ userId, username, email }, process.env.REFRESH_TOKEN_SECRET, {
//       expiresIn: '1d'
//     });
//     await Users.update({ refresh_token: refreshToken }, {
//       where: {
//         id: userId
//       }
//     });
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//       // secure: true //pakai jika sudah di deploy
//     });
//     res.json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       msg: "Terjadi kesalahan"
//     });
//   }
// }

//with emailorusername
export const Login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validasi input
    if (!identifier || !password) {
      return res.status(400).json({ msg: "Email/Username dan Password harus diisi" });
    }

    // Cari user berdasarkan email atau username
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    // Jika user tidak ditemukan
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    // Verifikasi password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });

    // Generate access token dan refresh token
    const userId = user.id;
    const username = user.username;
    const email = user.email;

    const accessToken = jwt.sign(
      { userId, username, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20s' }
    );
    const refreshToken = jwt.sign(
      { userId, username, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Simpan refresh token ke database
    await Users.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );

    // Kirim refresh token via cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
      // secure: true // gunakan ini saat di deploy (HTTPS)
    });

    // Kirim access token ke client
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan" });
  }
};


export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(204)
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken
    }
  })
  if (!user[0]) return res.sendStatus(204)
  const userId = user.id
  await Users.update({ refreshToken: null }, {
    where: {
      id: userId
    }
  })
  res.clearCookie('refreshToken')
  return res.sendStatus(200)
}