import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
export class WaitingDuelMessage {
    constructor(dataDuel) {
        this.dataDuel = dataDuel;
        this.houseDescription = " de la maison ";
    }

    createDuelMessage() {
        return this.dataDuel.challenger.toString() + this.houseDescription + this.dataDuel.houseChallenger +
            " tente d'utiliser " + this.dataDuel.spellChallenger.toLowerCase() + " sur " + this.dataDuel.opponent.toString() +
            this.houseDescription + this.dataDuel.houseOpponent + "."; 
    }

    createDuelButton() {
        return new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("contreDuel")
        .setLabel("Contre")
        .setStyle(ButtonStyle.Primary))
    }

    sendWaitingDuelMessage(interaction) {
        //Créer le message et l'envoyer*
        const embedShowDuel = new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle("Duel Lancé !")
            .setThumbnail("https://static1.millenium.org/articles/6/39/45/26/@/1627043-promo-sorting-at-2x-1d78011609faa33566d21de2d0a11457-article_m-1.png")
            .setDescription(this.createDuelMessage());

        interaction.message.channel.send({ embeds: [embedShowDuel], components :[this.createDuelButton()] });
        interaction.message.delete();
    }
}