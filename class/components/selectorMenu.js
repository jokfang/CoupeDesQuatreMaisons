import { StringSelectMenuBuilder } from "discord.js";

export class SelectorMenu {
    constructor({ id, placeholder }) {
        this.selectMenu = new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder(placeholder);
    }

    setOptions(options) {
        options.forEach(option => {
            this.selectMenu.addOptions(option);
        });
    }

    getSelector() {
        return this.selectMenu;
    }
}