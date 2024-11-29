import { Sequelize } from "sequelize";

const db = new Sequelize('toramdb', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
})

export default db