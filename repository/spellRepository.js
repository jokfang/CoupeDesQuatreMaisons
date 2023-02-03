import mysql from "mysql2";
import * as houses from "../data/info.cjs";

export class SpellRepository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getSpells(channel) {
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
    const query = "select * from Spell where channelId = ? and serverId = ?";
    const retour = await con
      .promise()
      .query(query, [channel.id, channel.guildId]);
    con.end();

    return retour[0];
  }

  async getSpellsOfHouse(channel, idHousePlayer) {
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
    const query = "select * from Spell where channelId = ? and serverId = ? and roleId is null";
    const retour = await con
      .promise()
      .query(query, [channel.id, channel.guildId, idHousePlayer]);
    con.end();

    return retour[0];
  }
}
