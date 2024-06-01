import { MysqlRequest } from "./mysql.adapter.js";

export class HouseRepository {

    constructor() {
        this.id = '';
        this.roleId = '';
        this.ratio = 0;
    }

    async insertIntoMembre(idDiscord, maison) {
        return await new MysqlRequest().query("insert ignore into membre values(?,?,'',current_date(), 0)", [idDiscord, maison]);
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

    async getMaison(house) {
        const retour = await new MysqlRequest().query("select * from team where nom = ?", [house]);
        if (retour)
            return retour[0][0];
    }

    async getMaisons() {
        const retour = await new MysqlRequest().query("select * from team");
        const finalretour = retour[0];
        return retour[0];
    }

    async getHouseByRole(roles) {
        const houseRepos = new HouseRepository();
        const maisons = await houseRepos.getMaisons();

        for (let maison of maisons) {
            if (roles.find((memberRole) => memberRole == maison.roleId)) {
                this.name = await maison.nom;
                this.id = await maison.roleId;
                this.ratio = await maison.ratio;
            }
        }
        return { 'id': this.id, 'name': this.name, 'ratio': this.ratio };
    }

    async deleteMaison(messageId) {
        return await new MysqlRequest().query("delete from team where messageId = ?", [messageId]);
    }
}