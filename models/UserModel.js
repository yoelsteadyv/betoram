import { Sequelize } from "sequelize";
import db from '../config/database.js'

const { DataTypes } = Sequelize


const Users = db.define('users', {
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  ign: {
    type: DataTypes.STRING,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  codeLand: {
    type: DataTypes.STRING,
    unique: true
  },
  levelBuff: {
    type: DataTypes.STRING
  },
  buffName: {
    type: DataTypes.STRING
  },
  secLevelBuff: {
    type: DataTypes.STRING,
    allowNull: true
  },
  secBuffName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refresh_token: {
    type: DataTypes.TEXT
  }
}, {
  freezeTableName: true, // Tidak mengubah nama model menjadi plural

})

export default Users