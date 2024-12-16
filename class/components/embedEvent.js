import { EmbedBuilder, Colors } from "discord.js";

export class EmbedEvent {
    constructor(param) {
        this.embed = new EmbedBuilder()
            .setColor(Colors[param.color])
            .setTitle(param.title)
            .setDescription(param.description);
    }

    setThumbnail(thumb) {
        this.embed.setThumbnail(thumb);
    }

    setFooter(footer) {
        this.embed.setFooter(footer);
    }

    getEmbedEvent() {
        return this.embed;
    }
}

export default EmbedEvent