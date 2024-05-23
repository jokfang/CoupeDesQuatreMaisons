export class ErorrManager {
    constructor() {
        this.listError = data;
    }

    sendReply(message, index) {
        message.reply({ content: this.listError[index], ephemeral: true })
    }

    sendAuthor(message, index) {
        message.author.user.send(this.listError[index])
    }
}

const data = {
    'duel_notPlayer': "Vous ne pouvez pas choisir l'attaque de quelqu'un d'autre.",
    'duel_notRival': "Vous ne pouvez pas attaquer un membre de votre maison ou bien vous-même.",
    'notHouse_challenger': "Vous ne possède pas de maison.",
    'notHouse_opponent': "Votre cible ne possède pas de maison.",
}
