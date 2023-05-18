import mysql from "mysql2";
import * as houses from "../data/info.cjs";
import { spells } from "../librairy/Spell.js";

export class SpellRepository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getSpells(channel) {
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
      const query = "select * from spell where channelId = ?";
      const retour = await con.promise().query(query, [channel.id]);
      con.end();
      return retour[0];
    }
    catch (error) { console.log(error); }
  }

  async getSpellsOfHouse(channel, idHousePlayer) {
    return spells.filter(spell => spell.roleId == idHousePlayer && spell.channelId == channel);
  }
}
