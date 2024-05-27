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

    setFields(fields) {
        this.embed.setFields(fields);
    }

    getEmbedEvent() {
        return this.embed;
    }
}