import { SpellRepository } from "../repository/spellRepository.js";
import { ActionRowBuilder, SelectMenuBuilder } from "discord.js";

export class SpellSelect{
    constructor(interractionReceived, duelParameter) {
        this.duelParam = duelParameter;
        this.spellRepository = new SpellRepository();
        this.interraction = interractionReceived;
        this.spellList = null;
        this.idChallenger = null;
        this.idOpponent = null;
    }

    sendAttackSelect() {
        this.idChallenger = this.interraction.member.id;
        this.idOpponent = this.interraction.mentions.members.first().id;
        this.spellList = this.setSpellList(this.spellRepository);
        this.sendSpellSelect(idChallenger);
    }

    async sendCounterSelect() {
        this.idOpponent = this.interraction.message.member.id;
        this.spellList = await this.setSpellList(this.spellRepository);
        this.sendSpellSelect(this.idOpponent);
    }

    async setSpellList(spellRepository) {
        const spells = await this.spellRepository.getSpells(this.interraction.message.channel);;
        if (spells) {
            const list = new SelectMenuBuilder()
                .setCustomId('selectMenu_spell_' + this.duelParam.duelStatus)
                .setPlaceholder('Sort non sélectionné')
            for (let i = 0; i < spells.length; i++) {
                list.addOptions(
                    {
                        label: spells[i].spellName.charAt(0).toUpperCase() + spells[i].spellName.slice(1),
                        description: spells[i].spellDescription,
                        value: spells[i].spellName + '_' + this.idChallenger + '_' + this.idOpponent
                    }
                )
            }
            return list;
        } else {
            throw console.error('spellList vide');
        }
    }

    sendSpellSelect(id) {
      const row = new ActionRowBuilder().addComponents(this.spellList);
      this.interraction.reply({ content: '<@' + id + '> choisis ton Sort !', components: [row], ephemeral: false });
    }
        
}