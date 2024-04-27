import { Raids } from "../librairy/raids.js";
import { MysqlRequest } from "./mysql.adapter.js";

export class MonsterRepository {

  constructor() { }

  async getMonsters() {
    const retour = await new MysqlRequest().query("select * from monster");
    return retour[0];
  }

  async getRaidById(list) {
    return Raids.find(raid => raid.id == list);
  }

}
