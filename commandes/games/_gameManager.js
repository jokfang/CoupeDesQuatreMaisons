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

export async function isChallenger(interaction) {
    const contentMessage = interaction.message.content;
    const idChallenger = contentMessage.substring(2, 20);
    const authorInterraction = interaction.user;

    const isOk = (idChallenger == authorInterraction.id) ? true : false;
    if (!isOk) {
        const errorManager = new ErorrManager();
        errorManager.sendAuthor(interaction, 'duel_notPlayer');
    }
    return isOk;
}

export async function isOpponent(interaction) {
    const authorInterraction = interaction.user;
    let isOk;
    if (interaction.message.content !== '') {
        const contentMessage = interaction.message.content;
        const idOpponent = contentMessage.match(/[0-9]{18}/g)[1];
        isOk = (idOpponent == authorInterraction.id) ? true : false;

    } else {
        const contentMessage = interaction.message.embeds[0].description;
        const idOpponent = contentMessage.match(/[0-9]{18}/g)[1];
        isOk = (idOpponent == authorInterraction.id) ? true : false;
    }

    if (!isOk) {
        const errorManager = new ErorrManager();
        errorManager.sendAuthor(interaction, 'duel_notOpponent');
    }
    return isOk;
}

