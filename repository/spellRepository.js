import { MysqlRequest } from "./mysql.adapter.js";

export class SpellRepository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getSpells(channel) {
    const retour = await new MysqlRequest().query("select * from spell where channelId = ?", [channel.id]);
    return retour[0];
  }

  async getSpellsOfHouse(channel, idHousePlayer) {
    const retour = await new MysqlRequest().query("select * from spell where channelId = ? and roleId = ?", [channel.id, idHousePlayer]);
    return retour[0];
  }
}
