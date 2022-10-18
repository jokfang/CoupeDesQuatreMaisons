import mysql from "mysql2";
import * as houses from "../data/info.cjs";

export class Repository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getMaison(channel, maison) {
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
    const query = "select * from Coupe where channel = ? and nom = ?";
    const retour = await con.promise().query(query, [channel.id, maison]);
    con.end();

    return retour[0][0];
  }

  async getMaisons(channel) {
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
    const query = "select * from Coupe where serveur = ?";
    const retour = await con.promise().query(query, [channel.guildId]);
    con.end();

    return retour[0];
  }

  async addHouse(channel, houseName, blasonURL, couleur, messageId, role) {
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
    const query = "Insert into Coupe values (?,?,?,?,?,?,?)";
    const retour = await con
      .promise()
      .query(query, [
        channel.id,
        channel.guildId,
        houseName,
        blasonURL,
        couleur,
        messageId,
        role,
      ]);
    con.end();
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
    const query = "delete from Coupe where messageId = ?";
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

  async addMember(channel, user, maison) {
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
    const query = "insert into Membre values (?,?,?,?,0)";
    const retour = await con
      .promise()
      .query(query, [user, channel.guildId, channel.id, maison]);
    con.end();
  }

  async deleteMember(channel, user, maison) {
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
      "delete from Membre where memberId = ? and serverId = ? and channel = ? and maison = ? ";
    const retour = await con
      .promise()
      .query(query, [user, channel.guildId, channel.id, maison]);
    con.end();
  }

  async updateMemberPoint(channel, user, maison, points) {
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
      "update Membre set nbPoint = nbPoint + ? where memberId = ? and serverId = ? and channel = ? and maison = ? ";
    const retour = await con
      .promise()
      .query(query, [points, user, channel.guildId, channel.id, maison]);
    con.end();
  }
}
