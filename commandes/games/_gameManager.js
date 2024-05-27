import { ErorrManager } from "../../class/_errorManager.js";

export async function isRival(message, houseChallenger, houseOpponent) {
    const isRival = (houseChallenger.id === houseOpponent.id) ? false : true;
    if (!isRival) {
        const errorManager = new ErorrManager();
        errorManager.sendAuthor(message, 'duel_notRival');
    }
    return isRival;

}

export async function isHouse(message, member, isOpponent = false) {
    const isHouse = (member.id) ? true : false;
    if (!isHouse) {
        const errorManager = new ErorrManager();
        errorManager.sendAuthor(message, (isOpponent) ? 'notHouse_opponent' : 'notHouse_challenger');
    }
    return isHouse;
}

export async function isDuelist(interaction) {
    const contentMessage = interaction.message.content;
    const challenger = contentMessage.substring(2, 20);
    const player = interaction.user.id;

    const isDuelist = (challenger == player) ? true : false;
    if (!isDuelist) {
        const errorManager = new ErorrManager();
        errorManager.sendAuthor(interaction, 'duel_notPlayer');
    }
    return isDuelist;
}