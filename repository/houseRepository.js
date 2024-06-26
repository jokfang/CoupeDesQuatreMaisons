import { MysqlRequest } from "./mysql.adapter.js";

export class HouseRepository {

    constructor() { }

    async insertIntoMembre(idDiscord, maison) {
        return await new MysqlRequest().query("insert ignore into membre values(?,?,'',current_date(), 0)", [idDiscord, maison]);
    }

    //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
    async getMaison(house) {
        const retour = await new MysqlRequest().query("select t.*, g.scoreChannelId as 'scoreChannel' from team t, game g where nom = ? and t.gameId = g.id", [house]);
        if (retour)
            return retour[0][0];
    }

    async getMaisons() {
        const retour = await new MysqlRequest().query("select t.*, g.scoreChannelId as 'scoreChannel' from team t, game g where t.gameId = g.id");
        const finalretour = retour[0];
        return retour[0];
    }

    async deleteMaison(messageId) {
        return await new MysqlRequest().query("delete from team where messageId = ?", [messageId]);
    }

    async updateHouse(messageId, maison) {
        return new MysqlRequest().query("update team set gameId = ?, nom = ?, blason = ?, couleur = ?, messageId = ? where messageId = ?", [
            maison.gameId,
            maison.nom,
            maison.blason,
            maison.couleur,
            maison.messageId,
            messageId,
        ]);
    }
}