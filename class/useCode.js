import { specialAction } from "./specialAction.js";

export class useCode {
    constructor(interractionReceived) {
        this.challenger = interractionReceived.member;
        this.interraction = interractionReceived
        this.monsterMessage = interractionReceived.customId.split('_')[1];
        this.objectCode = interractionReceived.fields.components[0].components[0].value;
    }

    async useThis() {
        const object = JSON.parse(Buffer.from(this.objectCode, 'base64').toString());
        //si l'objet est valide
        if (object.member) {
            if (this.matchingUser(object.member)) {
                new specialAction(this.interraction).Assassiner();
            }
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