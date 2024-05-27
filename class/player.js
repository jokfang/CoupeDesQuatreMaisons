import { HouseRepository } from "../repository/houseRepository.js";
import { SpellRepository } from "../repository/spellRepository.js";

export class Player {

    constructor(channel, member) {
        this.channel = channel;
        this.roles = member._roles;
        this.id = member.id;
        this.username = member.displayName;
        this.ping = '<@' + member.id + '>';
    }

    async getHouse() {
        const houseRepos = new HouseRepository();
        const maisons = await houseRepos.getMaisons();
        let houseMember = {
            name: '',
            id: ''
        };

        for (let maison of maisons) {
            if (this.roles.find((memberRole) => memberRole == maison.roleId)) {
                houseMember.name = await maison.nom;
                houseMember.id = await maison.roleId;
            }
        }
        return houseMember;
    }

    async getSpell(isReformated = false) {
        const SpellRepo = new SpellRepository();
        const SpellList = await SpellRepo.getSpells(this.channel);

        if (!isReformated)
            return SpellList;

        let spellList_format = [];
        SpellList.forEach(spell => {
            spellList_format.push({
                label: spell.spellName.charAt(0).toUpperCase() + spell.spellName.slice(1),
                description: spell.spellDescription,
                value: spell.spellName
            });
        });

        return spellList_format;
    }
}