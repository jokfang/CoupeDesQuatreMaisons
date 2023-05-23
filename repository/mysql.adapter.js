import mysql from "mysql2";
import * as houses from "../data/info.cjs";

export class MysqlRequest{
  async query(request, binds = []) {
    try {
      const con = mysql.createConnection({
        host: houses.default.host,
        user: houses.default.user,
        password: houses.default.password,
        port: houses.default.port,
        database: houses.default.database,
      });
      con.connect(function (err) {
        if (err) {
          if (err.message.code === "ETIMEDOUT") {
            console.log("TimeOut de la BDD");
          }
        }
        //console.log("Connected to MySQLDB");
      });
      const retour = await con.promise().query(request, binds);
      con.end();
      return retour;
    } catch (error) {
      throw error;
    }
  }
}