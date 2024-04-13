export class Battlefield{
    constructor(interaction, bet) {
        this.interaction = interaction;
        this.defensor = undefined;
        this.opponent = undefined;
        this.bet = bet;
    }

    whoAttackWho() {
        this.defensor = '';
        this.opponent = '';
    }

    isAWarrior() {
        return this.opponent ? true : false;
    }

    betAmount() {
        
    }

    opponentRichEnough() {
        
    }

    deferAttack() {
        
    }

    conquer() {
        
    }
}