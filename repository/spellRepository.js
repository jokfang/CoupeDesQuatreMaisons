import mysql from "mysql2";
import * as houses from "../data/info.cjs";
import { spells } from "../librairy/Spell.js";

export class SpellRepository {
  constructor() {}
  //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
  async getSpells(channel) {
    return spells.filter(spell => spell.channelId == channel);
  }

  async getSpellsOfHouse(channel, idHousePlayer) {
    return spells.filter(spell => spell.roleId == idHousePlayer && spell.channelId == channel);;
  }
}
