import { Sequelize } from "sequelize";

// const db = new Sequelize("postgres://neondb_owner:AQHV79KrpRzZ@ep-divine-bar-a1x9z12h-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")

const db = new Sequelize('neondb', 'neondb_owner', 'AQHV79KrpRzZ', {
  host: 'ep-divine-bar-a1x9z12h-pooler.ap-southeast-1.aws.neon.tech',
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true }
  }
})
// const db = new Sequelize('toramdb', 'postgres', 'postgres', {
//   host: 'localhost',
//   dialect: 'postgres'
// })

export default db