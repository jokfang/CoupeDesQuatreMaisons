import { SpellRepository } from "../repository/spellRepository.js";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { DiscordMessageMethod } from "./discordMethod.js";

export class SpellSelect {
    constructor(interractionReceived, duelParameter) {
        this.duelParam = duelParameter;
        this.spellRepository = new SpellRepository();
        this.interraction = interractionReceived;
        this.spellList = null;
        this.idChallenger = null;
        this.idOpponent = null;
        this.channel = this.interraction.channel;
    }

    async sendAttackSelect() {
        this.idChallenger = this.interraction.member.id;
        this.idOpponent = this.interraction.mentions.members.first().id;
        this.spellList = await this.setSpellList(this.spellRepository);
        this.sendSpellSelect(this.idChallenger, this.interraction);
        await new Promise(resolve => setTimeout(resolve, 500));
        new DiscordMessageMethod(this.interraction).delete();
    }

    async sendCounterSelect() {
        this.idOpponent = this.interraction.message.member.id;
        this.spellList = await this.setSpellList(this.spellRepository);
        this.sendSpellSelect(this.idOpponent);
    }

    async setSpellList(spellRepository) {
        const spells = await this.spellRepository.getSpells(this.channel);
        if (spells) {
            const list = new StringSelectMenuBuilder()
                .setCustomId('selectMenu_spell_' + this.duelParam.duelStatus)
                .setPlaceholder('Sort non sélectionné');
            for (let i = 0; i < spells.length; i++) {
                list.addOptions(
                    {
                        label: spells[i].name.charAt(0).toUpperCase() + spells[i].name.slice(1),
                        description: spells[i].description,
                        value: spells[i].name + '_' + this.idChallenger + '_' + this.idOpponent
                    }
                );
            }
            return list;
        } else {
            throw console.error('spellList vide');
        }
    }

    sendSpellSelect(id) {
        const row = new ActionRowBuilder().addComponents(this.spellList);
        return this.interraction.reply({ content: '<@' + id + '> choisis ton Sort !', components: [row], ephemeral: false });
    }

}