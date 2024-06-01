import { ActionRowBuilder } from "discord.js";
import { DiscordMessageMethod } from "../discordMethod.js";
import Button from "../components/button.js";
import { EmbedEvent } from "../components/embedEvent.js";
import { duelRoll, formatString } from "../../commandes/items.js";
import { SpellRepository } from "../../repository/spellRepository.js";
import { bareme, currentCup } from "../../librairy/cupInfo.js";
import { MemberRepository } from "../../repository/memberRepository.js";

export class Duel {

    constructor(message, challenger, opponent, spellChallenger = "", spellOpponent = "", messageReferent = "") {
        this.message = message;
        this.messageReferent = messageReferent;
        this.challenger = challenger;
        this.spellChallenger = spellChallenger;
        this.opponent = opponent;
        this.spellOpponent = spellOpponent;
        this.housePrefix = " du clan ";
        this.rng_Challenger = 0;
        this.rng_Opponent = 0;
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

    async battle() {
        this.rng_Challenger = duelRoll(1, 10 + Number(this.challenger.house.ratio));
        this.rng_Opponent = duelRoll(1, 10 + Number(this.opponent.house.ratio));
        const challenger = {
            'member': this.challenger, 'spell': this.spellChallenger.toLowerCase(), 'score': this.rng_Challenger
        }
        const opponent = {
            'member': this.opponent, 'spell': this.spellOpponent.toLowerCase(), 'score': this.rng_Opponent
        };

        return {
            'isNull': (this.rng_Challenger === this.rng_Opponent) ? true : false,
            'winner': (this.rng_Challenger > this.rng_Opponent) ? challenger : opponent,
            'looser': (this.rng_Challenger > this.rng_Opponent) ? opponent : challenger,
        }
    }

    async allocationOfPoints(results) {
        const memberRepos = new MemberRepository();
        const winner = await memberRepos.getMemberInfo(results.winner.member.id);
        const looser = await memberRepos.getMemberInfo(results.looser.member.id);

        const cptChannel = this.message.channel.messages.client.channels.cache.get(
            currentCup
        );
        let indice = 0;
        if (winner && looser) {
            memberRepos.setBattlePoint(winner.idDiscord, parseInt(winner.battlePoint) + 1);
            memberRepos.setBattlePoint(looser.idDiscord, parseInt(looser.battlePoint) + 1);
            if (!results.isNull) {
                memberRepos.setPoint(winner.idDiscord, parseInt(winner.point) + 10);
                cptChannel.send("!add " + (parseInt(bareme.duel) + parseInt(indice)).toString() + " to " + results.winner.member.house.name);
                cptChannel.send("!remove " + bareme.duel + " to " + results.looser.member.house.name);
            }
        }
    }

    async setWinnerMessage(results) {
        const spellRepo = new SpellRepository();
        let winMessage = await spellRepo.getMessageByName(this.message.channel, results.winner.spell);
        if (winMessage) {
            if (results.isNull) {
                winMessage = "Oh ! Leurs attaques s'entre-choc et s'annulent toutes les deux. C'est une égalité !";
            } else {
                winMessage = await winMessage
                    .replace("@nameWinner", results.winner.member.ping)
                    .replace("@nameLooser", results.looser.member.ping)
                    .replace("@points", bareme.duel)
                    .replace("@houseLooser", results.looser.member.house.name ? "aux " + results.looser.member.house.name : '');
            }
        }
        const challengerResult = this.spellChallenger + " (" + this.rng_Challenger + ")";
        const opponentResult = this.spellOpponent + " (" + this.rng_Opponent + ")";

        const enbedEvent = new EmbedEvent(
            {
                color: 'Blue',
                title: 'Duel Terminé !',
                description: winMessage
            });
        const duelMessage = enbedEvent.getEmbedEvent().setFields(
            { name: formatString(results.winner.member.username), value: formatString(challengerResult), inline: true },
            { name: "Vs", value: "\u200B", inline: true },
            { name: formatString(results.looser.member.username), value: formatString(opponentResult), inline: true }
        );
        return duelMessage;

    }
    async sendWinnerMessage(interaction, winMessage) {
        await this.message.channel.send({ embeds: [winMessage] });

        new DiscordMessageMethod(this.messageReferent).delete();
        new DiscordMessageMethod(this.message).delete();
    }
}
