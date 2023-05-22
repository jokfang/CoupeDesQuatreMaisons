import mysql from "mysql2";
import * as houses from "../data/info.cjs";

export class MysqlRequest{
    constructor() {
        this.con = mysql.createConnection({
        host: houses.default.host,
        user: houses.default.user,
        password: houses.default.password,
        port: houses.default.port,
        database: houses.default.database,
      });
    }

  async query(request, binds = []) {
    try {
      this.con.connect(function (err) {
        if (err) {
          if (err.message.code === "ETIMEDOUT") {
            console.log("TimeOut de la BDD");
          }
        }
        //console.log("Connected to MySQLDB");
      });
      const retour = await this.con.promise().query(request, binds);
      this.con.end();
      return retour;
    } catch (error) {
      throw error;
    }
  }
}