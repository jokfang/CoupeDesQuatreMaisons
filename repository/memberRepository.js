import { MysqlRequest } from "./mysql.adapter.js";

export class MemberRepository {
    constructor() { }

    async setPoint(id, point) {
        const retour = await new MysqlRequest().query("update membre set battlePoint = ? where idDiscord = ?", [point, id]);
    }

    async getMemberInfo(id) {
        const retour = await new MysqlRequest().query("select * from membre where idDiscord = ?", [id]);
        return retour[0][0];
    }
}