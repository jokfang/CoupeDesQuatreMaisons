import { Raids } from "../librairy/raids.js";
import { MysqlRequest } from "./mysql.adapter.js";

export class Repository {
  
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getMaison(house) {
    return new MysqlRequest().query("select * from team where nom = ?", [house])[0][0];
  }

  async getMaisons() {
    return new MysqlRequest().query("select * from team")[0];
  }

  async deleteMaison(messageId) {
    return new MysqlRequest().query("delete from team where messageId = ?", [messageId]);
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
    return new MysqlRequest().query("select * from monster")[0];
  }
  
  async getRaidById(list) {
    return Raids.find(raid => raid.id == list);
  }
  
  async insertIntoMembre(idDiscord, maison) {
    return new MysqlRequest().query("insert ignore into membre values(?,?,'',current_date())", [idDiscord, maison])[0];
  }

  async getListItem(id) {
    return new MysqlRequest().query("select objet.name, objet.description, objet.id from inventory, objet where inventory.idDiscord = ? and inventory.idObject = objet.id", [id])[0];
  }
}
