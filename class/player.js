import { ActionRowBuilder } from "@discordjs/builders";
import { HouseRepository } from "../repository/houseRepository.js";
import SelectorMenu from "./components/selectorMenu.js";
import { DiscordMessageMethod } from "./discordMethod.js";
import { ButtonBuilder, EmbedBuilder } from "discord.js";
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
        const house = new HouseRepository();
        this.house = await house.getHouseByRole(this.roles);
        return this.house;
    }

    async spellRequest({ interaction, message, id_spell, message_selector }, isDelete) {
        const spell = new SpellRepository();
        const spellList = await spell.getSpells(this.channel);

        // Create selector
        const spellSelector = new SelectorMenu({ id: id_spell, placeholder: 'Sort non sélectionné' });
        spellSelector.setOptions(spellList);

        // Send selector
        const selector = new ActionRowBuilder()
            .addComponents(spellSelector.getSelector())

        const selectorMessage = await message.reply({ content: message_selector, components: [selector], ephemeral: false });

        if (isDelete) {
            await new Promise(resolve => setTimeout(resolve, 500));
            new DiscordMessageMethod(message).delete();
        } else {
            message.components[0].components[0] = ButtonBuilder.from(message.components[0].components[0]).setDisabled(true);
            const footer =
                message.embeds[0] = EmbedBuilder.from(message.embeds[0]).setFooter({ text: '[' + selectorMessage.id + '] En cours de sélection de compétence' });
            interaction.update({
                embeds: [message.embeds[0]],
                components: [interaction.message.components[0]]
            });
        }
    }


}