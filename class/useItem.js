import { Monster } from "./monster.js";

export class useItem {
    constructor(interractionReceived) {
        this.challenger = interractionReceived.member;
        this.interraction = interractionReceived;
        this.monsterMessageId = interractionReceived.customId.split('_')[1];
        this.objectId = interractionReceived.values[0].split('_')[1];
    }

    async react() {
        //si l'objet est valide
        const importClass = (await import('../item/' + this.objectId + '.js'))[this.objectId];
        const result = new importClass().onMonster();
        if (result.result == 4) {
            const monsterMessage = await this.interraction.channel.messages.fetch(this.monsterMessageId);
            if (monsterMessage)
                        new Monster(monsterMessage, this.interraction.member).counterMonstre(1);
            this.interraction.reply({ content: result.message, ephemeral: true });
        }
    }

    matchingUser(objectMember) {
        if (objectMember == 'all') {
            return true;
        } if (objectMember == this.challenger.id) {
            return true;
        }
        return false;
    }
}