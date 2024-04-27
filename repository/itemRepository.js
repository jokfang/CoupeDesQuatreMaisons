import { MysqlRequest } from "./mysql.adapter.js";

export class ItemRepository {
    async getListItem(id) {
        const retour = await new MysqlRequest().query("select objet.name, objet.description, objet.id from inventory, objet where inventory.idDiscord = ? and inventory.idObject = objet.id", [id]);
        return retour[0];
    }
}