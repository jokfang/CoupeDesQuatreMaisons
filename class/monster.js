import { MonsterRepository } from "../repository/monsterRepository.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from "discord.js";
import { simpleDice } from "../commandes/items.js";
import { currentCup, bareme, currentCupDuel } from "../librairy/cupInfo.js";
import { DiscordMessageMethod } from "./discordMethod.js";
import { addSilentPoint } from "../commandes/point.js";

export class Monster {
    constructor(message, author) {
        this.baseMessage = message.content == '' ? { message: message, channel: message.channel, member: author } : message;
    }

    async aWildMonsterAppear() {
        const embedTitle = "Une créature apparait !";

        const duelMessage =
            "Un monstre attaque, défendez vous";

        const monsters = await new MonsterRepository().getMonsters();
        const monster = monsters[simpleDice(0, monsters.length - 1)];
        //Créer le message et l'envoyer*
        const embedShowDuel = new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setTitle(embedTitle)
            .setDescription(duelMessage)
            .setThumbnail(monster.image)
            .addFields({ name: 'Attaquant', value: ' ', inline: true }, { name: 'Vie', value: monster.pdv + ' ', inline: true });

        const button = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("contreMonsters")
            .setLabel("Contre").setStyle(ButtonStyle.Success));

        button.addComponents(new ButtonBuilder()
            .setCustomId("specialAction")
            .setLabel("Action spéciale").setStyle(ButtonStyle.Primary));

        button.addComponents(new ButtonBuilder()
            .setCustomId("selectObject")
            .setLabel("Utiliser un objet").setStyle(ButtonStyle.Primary));
        await this.baseMessage.channel.messages.client.channels.cache.get(currentCupDuel).send({
            embeds: [embedShowDuel], components: [button]
        });
    }

    async counterMonstre(puissance = 1) {
        const embed = this.baseMessage.message ? this.baseMessage.message.embeds[0] : this.baseMessage.embeds[0];
        const pdv = parseInt(embed.fields[1].value) - puissance;
        const embedsEdited = new EmbedBuilder()
            .setColor(embed.color)
            .setTitle(embed.title)
            .setDescription(embed.description)
            .setThumbnail(embed.thumbnail.url);


        let edited = false;
        if (embed.fields[0].value == '') {
            embedsEdited.addFields({ name: 'Attaquant', value: '<@' + this.baseMessage.member + '>', inline: true }, { name: 'Vie', value: pdv + ' ', inline: true });
            this.baseMessage.message.edit({ embeds: [embedsEdited] });
            edited = true;
        }
        else if (embed.fields.length && !embed.fields[0]?.value.includes('<@' + this.baseMessage.member + '>')) {
            embedsEdited.addFields({ name: 'Attaquant', value: embed.fields[0].value + ', <@' + this.baseMessage.member + '>', inline: true }, { name: 'Vie', value: pdv + ' ', inline: true });
            edited = true;
        }


        if (edited) {
            if (parseInt(embedsEdited.data.fields[1].value) <= 0) {
                new DiscordMessageMethod(this.baseMessage.message).delete();
            }
            else {
                this.baseMessage.message.edit({ embeds: [embedsEdited] });
            }
            if (puissance > 0) {
                const cptChannel = this.baseMessage.message.client.channels.cache.get(currentCup);
                addSilentPoint(this.baseMessage.author || this.baseMessage.member, bareme.duel / 2, { channel: this.baseMessage.channel });
            }
        }
    }
}