export const duelDescription = {
    message: "",
    idGuild: "",
    idChannel: "",
    channel: "",
    idChallenger: "",
    challenger: "",
    houseChallenger: "",
    idHouseChallenger: "",
    spellChallenger: "",
    idOpponent: "",
    opponent: "",
    houseOpponent: "",
    idHouseOpponent: "",
    spellOpponent: "",
    battleType: "PVP",

    async create(message, dataSelectMenu, duelStatus){
        this.message = message;
        this.idGuild= message.guildId;
        this.idChannel= message.channelId;
        this.channel = message.channel;
        
        //opponent
        this.idOpponent = dataSelectMenu.split("_")[2];
        this.opponent = await message.guild.members.fetch(this.idOpponent);

        if (duelStatus == "attack") {
            //challenger
            this.spellChallenger = dataSelectMenu.split("_")[0];
            this.idChallenger = dataSelectMenu.split("_")[1];
            this.challenger = await message.guild.members.fetch(this.idChallenger);

        } else if (duelStatus == "counter") {
            //opponent 
            this.spellOpponent = dataSelectMenu.split("_")[0];

            //challenger
            const duelDescription = message.embeds[0].description;
            const spellStart = duelDescription.indexOf("utiliser ") + 9;
            const spellEnd = duelDescription.indexOf(" sur", -1);
            this.spellChallenger = duelDescription.substring(spellStart, spellEnd);

            const idStart = duelDescription.indexOf("<@") + 2;
            const idEnd = duelDescription.indexOf(">");
            this.idChallenger = duelDescription.substring(idStart, idEnd);
            if (idEnd < 0) {
              this.battleType = 'PVE';
            } else {              
                this.challenger = await message.guild.members.fetch(this.idChallenger);
            }
        }
    }
}