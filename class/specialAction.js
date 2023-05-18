import { ActionRowBuilder, StringSelectMenuBuilder, TextInputBuilder, ModalBuilder } from "@discordjs/builders";
import { simpleDice } from "../commandes/items.js";
import { currentCup } from "../librairy/cupInfo.js";
import { Monster } from "../class/monster.js";
import { TextInputStyle } from "discord.js";

export class specialAction {
    constructor(interractionReceived) { 
        this.idChallenger = interractionReceived.member.id;
        this.interraction = interractionReceived
    }

    async sendPannel() {
        this.sendHideMessage(this.idChallenger);
    }

    async sendHideMessage(id) {
        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectAction')
					.setPlaceholder('Choisis ton action')
					.addOptions(
						{
							label: 'Assassiner',
							description: 'Peut faire disparaitre une créature, risqué',
							value: 'assassin',
						},
						{
							label: 'Utiliser un objet',
							description: 'Permet d\'utiliser un objet',
							value: 'useItem',
                        },
                        {
							label: 'Utiliser un code',
							description: 'Permet d\'utiliser un code',
							value: 'useCode',
						}
					),
			);

		await this.interraction.reply({ content: '<@' + id + '> choisis ton action !', ephemeral: true, components: [row] });
      //this.interraction.reply({ content: 'test', components:[new ActionRowBuilder().addComponents(this.buildRows())], ephemeral: false });
    }

    async buildRows() {
        const list = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Nothing selected')
            .addOptions(
                {
                    label: 'Select me',
                    description: 'This is a description',
                    value: 'first_option',
                },
                {
                    label: 'You can select me too',
                    description: 'This is also a description',
                    value: 'second_option',
                }
            );
        return list;
    }

    async setAction() {
        if (this.interraction.values[0] == 'assassin') {
            this.Assassiner();
        }
        else if (this.interraction.values[0] == 'useCode') {
            this.openCatchFields();
        }
    }

    async Assassiner() {
        const letDiceRoll = simpleDice(1, 4);
        try {
            const monsterMessage = await this.interraction.channel.messages.fetch(this.interraction.message.reference.messageId);
            if (!monsterMessage.embeds[0].fields[0]?.value.includes('<@' + this.interraction.member.id + '>')){
                if (letDiceRoll == 3) {
                    if (monsterMessage)
                        new Monster(monsterMessage, this.interraction.member).counterMonstre(1000);
                    this.interraction.reply({ content: 'La créature a été assassinée, tu peux "rejeter" ce message et celui auquel il répond', ephemeral: true });
                } else if (letDiceRoll == 1) {
                    if (monsterMessage)
                        new Monster(monsterMessage, this.interraction.member).counterMonstre(0);
                    const cptChannel = this.interraction.message.client.channels.cache.get(currentCup);
                    cptChannel.send("!remove " + (10).toString() + " to <@" + this.interraction.member.id + '>');
                    this.interraction.reply({ content: 'La créature se retourne contre toi, tu perds 10 points, tu peux "rejeter" ce message et celui auquel il répond', ephemeral: true });
                }
                else {
                    if (monsterMessage)
                        new Monster(monsterMessage, this.interraction.member).counterMonstre(0);
                    this.interraction.reply({ content: 'La créature t\'as vu, tu ne marque aucun point, tu peux "rejeter" ce message et celui auquel il répond', ephemeral: true });
                }
            } else {
                this.interraction.reply({ content: 'Tu as déjà attaqué cette créature, tu peux "rejeter" ce message et celui auquel il répond', ephemeral: true });
            }
        }catch {
                    this.interraction.reply({ content: 'La créature n\'existe plus, tu peux "rejeter" ce message et celui auquel il répond', ephemeral: true });
        }
    }

    async openCatchFields() {
        const monsterMessage = await this.interraction.channel.messages.fetch(this.interraction.message.reference.messageId);
        if (!monsterMessage.embeds[0].fields[0]?.value.includes('<@' + this.interraction.member.id + '>')) {
            const modal = new ModalBuilder()
                .setCustomId('myModal_' + monsterMessage.id)
                .setTitle('My Modal');
            const codeInput = new TextInputBuilder()
                .setCustomId('codeInput')
                .setLabel("Colle ici le code objet")
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(codeInput);

            // Add inputs to the modal
            modal.addComponents(firstActionRow);

            // Show the modal to the user
            await this.interraction.showModal(modal);
        }
    }
}