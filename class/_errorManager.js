export class ErorrManager {
    constructor() {
        this.listError = data;
    }

    sendReply(message, index) {
        message.reply({ content: this.listError[index], ephemeral: true })
    }

    sendAuthor(message, index) {
        // if (message.author)
        //     message.author.user.send(this.listError[index])
        if (message.member)
            message.member.send(this.listError[index])
    }
}

const data = {
    'duel_notOpponent': "Vous ne pouvez pas accepter/refuser le duel de quelqu'un d'autre.",
    'duel_notPlayer': "Vous ne pouvez pas choisir la compétence de quelqu'un d'autre.",
    'duel_notRival': "Vous ne pouvez pas attaquer un membre de votre maison ou bien vous-même.",
    'notHouse_challenger': "Vous ne possède pas de maison.",
    'notHouse_opponent': "Votre cible ne possède pas de maison.",
}
