import mysql from "mysql2";
import * as houses from "../data/info.cjs";

export class MysqlRequest{
  async query(request, binds = []) {
    let retry = 0;
    while (retry < 3) {
      try {
        const con = mysql.createConnection({
          host: houses.default.host,
          user: houses.default.user,
          password: houses.default.password,
          port: houses.default.port,
          database: houses.default.database,
          connectTimeout: 30000
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
        con.destroy();
        return retour;
      } catch (error) {
        retry += 1;
        console.log(request);
        console.log(binds);
        console.log(error);
      }
    }
  }
}