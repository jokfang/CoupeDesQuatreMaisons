
import { DuelRequest } from "../../class/games/duel/duelRequest.js";
import { Player } from "../../class/player.js";
import { isHouse, isRival } from "./_gameManager.js";


export async function duel_start(message, challenger, opponent) {
    const Challenger = new Player(message.channel, challenger);
    const Opponent = new Player(message.channel, opponent);

    let notError = true;
    notError = await (isHouse(message, await Challenger.getHouse()));
    notError = await (isHouse(message, await Opponent.getHouse(), true));
    notError = await (isRival(message, await Challenger.getHouse(), await Opponent.getHouse()));

    if (notError) {
        // await createSelectMenuSpell(message, houseChallenger.id, duelStatus);
        const duelRequet = new DuelRequest(message, Challenger, Opponent);
        duelRequet.spellRequest();
    }
}

export async function duel_request(interaction) {
    const idOpponent = interaction.message.content.substring(27, 45);
    const opponent = new Player(interaction.channel, await interaction.channel.guild.members.fetch(idOpponent));
    const challenger = new Player(interaction.channel, interaction.member);
    const spellChallenger = interaction.values[0];

    const duelRequest = new DuelRequest(interaction.message, challenger, opponent, spellChallenger);
    await duelRequest.setDuelMessage();
    await duelRequest.sendDuelMessage();
}


export async function duel_response() {

}

export async function duel_attack() {

}

export async function duel_end() {

}