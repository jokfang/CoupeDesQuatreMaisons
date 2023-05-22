import { MysqlRequest } from "./mysql.adapter.js";

export class SpellRepository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getSpells(channel) {
    return new MysqlRequest().query("select * from spell where channelId = ?", [channel.id])[0];
  }

  async getSpellsOfHouse(channel, idHousePlayer) {
    return new MysqlRequest().query("select * from spell where channelId = ? and roleId = ?", [channel.id, idHousePlayer])[0];
  }
}
