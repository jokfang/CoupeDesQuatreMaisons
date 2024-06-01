
import { DuelRequest } from "../../class/games/duelRequest.js";
import { Player } from "../../class/player.js";
import { getMemberById } from "../components/member.js";
import { isHouse, isRival } from "./_gameManager.js";
import { Duel } from "../../class/duel.js";


export async function duel_getSpellOfThechallenger(message, challenger, opponent) {
    const Challenger = new Player(message.channel, challenger);
    const Opponent = new Player(message.channel, opponent);

    let notError = true;
    notError = await (isHouse(message, await Challenger.getHouse()));
    notError = await (isHouse(message, await Opponent.getHouse(), true));
    notError = await (isRival(message, await Challenger.getHouse(), await Opponent.getHouse()));

    if (notError) {
        const param = {
            'interaction': null,
            'message': message,
            'id_spell': 'duel_spellChallenger',
            'message_selector': '<@' + Challenger.id + '> Vs <@' + Opponent.id + '> | Sélection de la compétence du Challenger'
        }
        Challenger.spellRequest(param, true);
    }
}

export async function duel_sendRequestDuel(interaction) {
    const idOpponent = interaction.message.content.substring(27, 45);
    const opponent = new Player(interaction.channel, await getMemberById(interaction.channel, idOpponent));
    const challenger = new Player(interaction.channel, interaction.member);
    const spellChallenger = interaction.values[0];

    const duelRequest = new DuelRequest(interaction.message, challenger, opponent, spellChallenger);
    await duelRequest.setDuelMessage();
    await duelRequest.sendDuelMessage();
}

export async function duel_getSpellOfTheOpponent(interaction) {
    const idDuelist = interaction.message.embeds[0].description.match(/[0-9]{18}/g);
    const Challenger = new Player(interaction.channel, await getMemberById(interaction.channel, idDuelist[0]));
    const Opponent = new Player(interaction.channel, await getMemberById(interaction.channel, idDuelist[1]));

    const param = {
        'interaction': interaction,
        'message': interaction.message,
        'id_spell': 'duel_spellOpponent',
        'message_selector': '<@' + Challenger.id + '> Vs <@' + Opponent.id + '> | Sélection de la compétence de l\'adversaire'
    }
    Opponent.spellRequest(param, false);
}



export async function duel_dataCreate(interaction) {
    const idDuelist = interaction.message.content.match(/[0-9]{18}/g);
    const messageReferent = await interaction.channel.messages.fetch(interaction.message.reference.messageId);

    const challenger = new Player(interaction.channel, await getMemberById(interaction.channel, idDuelist[0]));
    await challenger.getHouse();
    const spellChallenger = messageReferent.embeds[0].description.match(/(?<=utiliser\s+)(\w+)(?=\ssur)/g)[0];
    const opponent = new Player(interaction.channel, await getMemberById(interaction.channel, idDuelist[1]));
    await opponent.getHouse();
    const spellOpponent = interaction.values[0];

    return new DuelRequest(interaction.message, challenger, opponent, spellChallenger, spellOpponent, messageReferent);
}

export async function resolveDuel(interaction) {
    const duel = await duel_dataCreate(interaction);
    const results = await duel.battle()
    const message = await duel.setWinnerMessage(results);
    duel.sendWinnerMessage(interaction, message);
    duel.allocationOfPoints(results);
}