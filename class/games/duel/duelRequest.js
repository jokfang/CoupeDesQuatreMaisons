import { ActionRowBuilder, ButtonStyle } from "discord.js";
import { SelectorMenu } from "../../components/selectorMenu.js";
import { DiscordMessageMethod } from "../../discordMethod.js";
import Button from "../../components/button.js";
import { EmbedEvent } from "../../components/embedEvent.js";

export class DuelRequest {

    constructor(message, challenger, opponent, spellChallenger = "") {
        this.message = message;
        this.challenger = challenger;
        this.opponent = opponent;
        this.spellChallenger = spellChallenger;
        this.housePrefix = " du clan ";
    }

    async spellRequest() {
        // create selector of spell
        const spellList = await this.challenger.getSpell(true);
        const selectorMenu = new SelectorMenu({ id: 'duel_spellChallenger', placeholder: 'Sort non sélectionné' });
        selectorMenu.setOptions(spellList);
        const spellSelector = selectorMenu.getSelector();

        // send Selector
        const row = new ActionRowBuilder().addComponents(spellSelector);
        this.message.reply({ content: '<@' + this.challenger.id + '> Vs <@' + this.opponent.id + '> | Sélection la compétence du Challenger', components: [row], ephemeral: false });

        await new Promise(resolve => setTimeout(resolve, 500));
        new DiscordMessageMethod(this.message).delete();
    }

    async setDuelMessage() {
        const houseChallenger = await this.challenger.getHouse();
        const houseOppenent = await this.opponent.getHouse();

        this.duelMessage = await this.challenger.ping + this.housePrefix + houseChallenger.name +
            " tente d'utiliser " + this.spellChallenger.toLowerCase() + " sur " + this.opponent.ping +
            this.housePrefix + houseOppenent.name + ".";
    }

    async createButton() {
        const yes = new Button({ id: 'duel_yes', label: 'Accepter', style: 'Green' });
        const no = new Button({ id: 'duel_no', label: 'Refuser', style: 'Blue' });

        return new ActionRowBuilder()
            .addComponents(yes.getButton())
            .addComponents(no.getButton());
    }

    async sendDuelMessage() {
        const duelMessage = new EmbedEvent(
            {
                color: 'Blue',
                title: 'Duel Lancé !',
                description: this.duelMessage
            });
        duelMessage.setThumbnail('https://cdn.pixabay.com/photo/2012/04/14/13/35/shield-33957_1280.png');

        this.message.channel.send({ embeds: [duelMessage.getEmbedEvent()], components: [await this.createButton()] })
            .then(new DiscordMessageMethod(this.message).delete());
    }
}