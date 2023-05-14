import mysql from "mysql2";
import * as houses from "../data/info.cjs";
import { Monster } from "../librairy/Monster.js";
import { maisons } from "../librairy/Coupe.js";
import { Raids } from "../librairy/raids.js";

export class Repository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getMaison(house) {
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
    const query = "select * from team where nom = ?";
    const retour = await con.promise().query(query, [house]);
    con.end();
    return retour[0][0];
  }

  async getMaisons() {
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
    const query = "select * from team";
    const retour = await con.promise().query(query, []);
    con.end();
    return retour[0];
  }

  async deleteMaison(messageId) {
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
    const query = "delete from team where messageId = ?";
    const retour = await con.promise().query(query, [messageId]);
    con.end();
  }

  async updateHouse(channel, messageId, maison) {
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
    const query =
      "update Coupe set channel = ?, serveur = ?, nom = ?, blason = ?, couleur = ?, messageId = ? where messageId = ?";
    const retour = await con
      .promise()
      .query(query, [
        channel.id,
        channel.guildId,
        maison.nom,
        maison.blason,
        maison.couleur,
        maison.messageId,
        messageId,
      ]);
    con.end();
  }

  async getMonster() {
    return Monster;
  }
  
  async getRaidById(list) {
    return Raids.find(raid => raid.id == list);
}
}
