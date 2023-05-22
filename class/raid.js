import { Repository } from "../repository/repository.js";
import {
    EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle
} from "discord.js";
import { Raids } from "../librairy/raids.js";
import { currentCup } from "../librairy/cupInfo.js";
import { bareme } from "../librairy/cupInfo.js";
import { DiscordMessageMethod } from "./discordMethod.js";

export class Raid {
    constructor(message, author) {
        this.baseMessage = message.content == '' ? { message: message, channel: message.channel, member: author } : message;
        this.interactionMessage = message.message;
    }


    createRaid(list) {
        this.aRaidMonsterAppear(list);
    }

    async aRaidMonsterAppear(list) {
        const raid = await new Repository().getRaidById(list);

        //Créer le message et l'envoyer*
        this.aMonsterAppear(raid.monsters[0], raid.name)
    }

    async counterMonstre(puissance = 1) {
        const embed = this.baseMessage.message.embeds[0];
        const pdv = parseInt(embed.fields[1].value) - puissance;
        const embedsEdited = new EmbedBuilder()
            .setColor(embed.color)
            .setTitle(embed.title)
            .setDescription(embed.description)
            .setThumbnail(embed.thumbnail.url);
        
        
        let edited = false;
        if(embed.fields[0].value == ''){   
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
                this.next();
                new DiscordMessageMethod(this.baseMessage.message).delete();
            }
            else {
            this.baseMessage.message.edit({ embeds: [embedsEdited] });
            }
            if (puissance > 0) {
                const cptChannel = this.baseMessage.message.client.channels.cache.get(currentCup);
                cptChannel.send("!add " + (bareme.duel / 2).toString() + " to <@" + this.baseMessage.member + '>');
            }
        }
    }

    async next() {
        const list = Raids.find(raid =>
            raid.name == this.interactionMessage.embeds[0].title);
        const thisMonster = list.monsters.find(monster =>
            monster.image == this.interactionMessage.embeds[0].thumbnail.url);
        if (thisMonster.nextImage) {
            const nextMonster = list.monsters.find(monster =>
                monster.image == thisMonster.nextImage);
            this.aMonsterAppear(nextMonster, list.name);
            
        }
    }

    aMonsterAppear(monster, raidName) {
     const embedTitle = raidName;

        const duelMessage =
            "Un monstre attaque, défendez vous";
        
        //Créer le message et l'envoyer*
        const embedShowDuel = new EmbedBuilder()
        .setColor(Colors.Aqua)
        .setTitle(embedTitle)
        .setDescription(duelMessage)
        .setThumbnail(monster.image)
        .addFields({ name: 'Attaquant', value: ' ', inline: true }, { name: 'Vie', value: monster.pdv + ' ', inline: true });

        const button = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("contreRaid")
            .setLabel("Contre").setStyle(ButtonStyle.Success));
        
        button.addComponents(new ButtonBuilder()
            .setCustomId("specialAction")
            .setLabel("Action spéciale").setStyle(ButtonStyle.Primary));
        return this.baseMessage.channel.messages.client.channels.cache.get('1083394634903994419').send({ embeds: [embedShowDuel], components:[button]
        });   
    }
}