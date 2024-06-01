import { EmbedBuilder, Colors } from "discord.js";

export class event{
    constructor(param) {
        this.event = new EmbedBuilder();
    }

    setColor(color) {
        this.event.setColor(color);
    }
}