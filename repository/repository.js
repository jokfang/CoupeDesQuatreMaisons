import { Raids } from "../librairy/raids.js";
import { MysqlRequest } from "./mysql.adapter.js";

export class Repository {
  
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getMaison(house) {
    const retour = await new MysqlRequest().query("select * from team where nom = ?", [house]);
    if(retour)
      return retour[0][0];
  }

  async getMaisons() {
    const retour = await new MysqlRequest().query("select * from team");
    const finalretour = retour[0];
    return retour[0];
  }

  async deleteMaison(messageId) {
    return await new MysqlRequest().query("delete from team where messageId = ?", [messageId]);
  }

  async updateHouse(channel, messageId, maison) {
    return new MysqlRequest().query("update Coupe set channel = ?, serveur = ?, nom = ?, blason = ?, couleur = ?, messageId = ? where messageId = ?", [
        channel.id,
        channel.guildId,
        maison.nom,
        maison.blason,
        maison.couleur,
        maison.messageId,
        messageId,
      ]);
  }

  async getMonsters() {
    const retour = await new MysqlRequest().query("select * from monster");
    return retour[0];
  }
  
  async getRaidById(list) {
    return Raids.find(raid => raid.id == list);
  }
  
  async insertIntoMembre(idDiscord, maison) {
    return await new MysqlRequest().query("insert ignore into membre values(?,?,'',current_date(), 0)", [idDiscord, maison]);
  }

  async getListItem(id) {
    const retour = await new MysqlRequest().query("select objet.name, objet.description, objet.id from inventory, objet where inventory.idDiscord = ? and inventory.idObject = objet.id", [id]);
    return retour[0];
  }

  async setPoint(id, point) {
    const retour = await new MysqlRequest().query("update membre set battlePoint = ? where idDiscord = ?", [point, id]);
  }

  async getMemberInfo(id) {
    const retour = await new MysqlRequest().query("select * from membre where idDiscord = ?", [id]);
    return retour[0][0];
  }
}
