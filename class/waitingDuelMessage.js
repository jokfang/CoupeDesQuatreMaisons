import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } from "discord.js";
import { Repository } from "../repository/repository.js";
import { DiscordMessageMethod } from "./discordMethod.js";
export class WaitingDuelMessage {
    constructor(dataDuel) {
        this.dataDuel = dataDuel;
        this.houseDescription = " du clan ";
    }

    createDuelMessage() {
        const repo = new Repository();
        repo.insertIntoMembre(this.dataDuel.idChallenger, this.dataDuel.houseChallenger);
        repo.insertIntoMembre(this.dataDuel.idOpponent, this.dataDuel.houseOpponent);
        return this.dataDuel.challenger.toString() + this.houseDescription + this.dataDuel.houseChallenger +
            " tente d'utiliser " + this.dataDuel.spellChallenger.toLowerCase() + " sur " + this.dataDuel.opponent.toString() +
            this.houseDescription + this.dataDuel.houseOpponent + "."; 
    }

    createDuelButton() {
        return new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("contreDuel")
            .setLabel("Contre")
            .setStyle(ButtonStyle.Primary));
    }

    sendWaitingDuelMessage(interaction) {
        //Créer le message et l'envoyer*
        const embedShowDuel = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Duel Lancé !")
            .setThumbnail("https://cdn.shopify.com/s/files/1/0003/8263/1983/files/Triforce_Shards_1_large.png?v=1578654003")
            .setDescription(this.createDuelMessage());

        interaction.message.channel.send({ embeds: [embedShowDuel], components: [this.createDuelButton()] })
            .then(new DiscordMessageMethod(interaction.message).delete());
        
    }
}