import { getRandomInt } from "../commandes/items.js";
import { SpellRepository } from "../repository/spellRepository.js";
import { EmbedBuilder } from "discord.js";
import { idRoom, bareme } from "../librairy/cupInfo.js";
export class Duel{
    constructor(dataDuel,messageDuel) {
        this.dataDuel = dataDuel;
        this.channel = messageDuel.channel;
        this.messageDuel = messageDuel;
        this.rng_Challenger = 0;
        this.rng_Opponent = 0;
        this.duelNull = false;
    }

    letsRoll() {
        this.rng_Challenger = getRandomInt(1, 10+Number(this.dataDuel.ratioChallenger));
        this.rng_Opponent = getRandomInt(1, 10+Number(this.dataDuel.ratioOpponent));
        
        if (this.dataDuel.idChallenger == 'u' && this.rng_Challenger >= this.rng_Opponent) {
            this.rng_Opponent = this.rng_Challenger;
            this.rng_Challenger -= 1;
        }
    }

    setDataWin() {
        let dataWin = {
            nameWinner: "",
            houseWinner: "",
            spellWinner: "",
            nameLooser: "",
            houseLooser: "",
        };

        if (this.rng_Challenger == this.rng_Opponent) {
            this.duelNull = true;
        } else if (this.rng_Challenger > this.rng_Opponent) {
            dataWin.nameWinner = this.dataDuel.challenger;
            dataWin.nameLooser = this.dataDuel.opponent;
            dataWin.houseWinner = this.dataDuel.houseChallenger;
            dataWin.houseLooser = this.dataDuel.houseOpponent;
            dataWin.spellWinner = this.dataDuel.spellChallenger;
        } else {
            dataWin.nameWinner = this.dataDuel.opponent;
            dataWin.nameLooser = this.dataDuel.challenger;
            dataWin.houseWinner = this.dataDuel.houseOpponent;
            dataWin.houseLooser = this.dataDuel.houseChallenger;
            dataWin.spellWinner = this.dataDuel.spellOpponent;
        }

        return dataWin;
    }

    async resolveDuel(interaction) {
        this.letsRoll();
        const dataWin = await this.setDataWin();

        // Création du message du combat
        const winMessage = await this.createWinMessage(dataWin, this.channel);

        await this.channel.send({ embeds: [winMessage] });
        await interaction.message.delete();
        await this.messageDuel.delete();

        if (!this.duelNull) {
            const cptChannel = this.channel.messages.client.channels.cache.get(
                idRoom.hogwart
            );
            let indice = 0;
            if (this.dataDuel.opponent._roles.find((memberRole) => memberRole == '1073201979062497300') && dataWin.houseWinner == 'Mangemort') {
                indice += 10;
            }
            cptChannel.send("!add " + (parseInt(bareme.duel) + parseInt(indice)).toString() + " to " + dataWin.houseWinner);
            if (this.dataDuel.idChallenger != 'u') {
                cptChannel.send("!remove " + bareme.duel + " to " + dataWin.houseLooser);
            }
        }
    }
    async createWinMessage(dataWin, channel) {
        let winMessage;
        const mySpellRepository = new SpellRepository();
        const spells = await mySpellRepository.getSpells(this.channel);
        if (spells) {
            winMessage = spells.find(
                (spell) => spell.spellName.toLowerCase() == dataWin.spellWinner.toLowerCase()
            );

            if (!winMessage) {
                winMessage =
                    "Oh ! Leurs attaques s'entre-choc et s'annulent toutes les deux. c'est une égalité !";
            } else {
                if (dataWin.nameLooser == '') {
                    dataWin.nameLooser = 'une créature';
                }

                //on construit le winMessage
                winMessage = winMessage.spellMessage;
                winMessage = await winMessage
                    .replace("@nameWinner", dataWin.nameWinner)
                    .replace("@nameLooser", dataWin.nameLooser)
                    .replace("@points", bareme.duel)
                    .replace("@houseLooser", dataWin.houseLooser ? "aux " + dataWin.houseLooser : '');

            }
        }

        let challengerResult = '';
        let challengerName = '';
        if (this.dataDuel.idChallenger == 'u') {
            challengerResult = "Attaque" + " (" + this.rng_Challenger + ")";
            challengerName = 'une créature';
        } else {
            challengerResult = this.dataDuel.spellChallenger + " (" + this.rng_Challenger + ")";
            challengerName = this.dataDuel.challenger.displayName;
        }
        
        const opponentResult = this.dataDuel.spellOpponent + " (" + this.rng_Opponent + ")";
        const opponentName = this.dataDuel.opponent.displayName;

        return new EmbedBuilder()
            .setColor(0x00ffff)
            .setTitle("Duel Terminé !")
            .setDescription(winMessage)
            .addFields(
                { name: challengerName, value: challengerResult, inline: true },
                { name: "Vs", value: "\u200B", inline: true },
                { name: opponentName, value: opponentResult, inline: true }
            );
    }
}