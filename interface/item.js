export class item{
    constructor() {
        if (!this.onMonster) {
            throw new Error("item's must have onMonster method");
        }
        /*if (!this.onPlayer) {
            throw new Error("item's must have onPlayer method");
        }*/
    }
}