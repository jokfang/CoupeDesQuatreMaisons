export class DiscordMessageMethod { 
    constructor(messageToSet) {
        this.message = messageToSet
    }


    async delete() { 
        try {
            this.message.delete();
        }
        catch (error) {
            this.message.reply(error);
        }
    }
    
}