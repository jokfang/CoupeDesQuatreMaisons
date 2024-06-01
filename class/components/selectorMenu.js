import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export class SelectorMenu {
    constructor({ id, placeholder }) {
        this.selectMenu = new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder(placeholder);
    }

    setOptions(options) {
        options.forEach(option => {
            const optionsFormated = new StringSelectMenuOptionBuilder()
                .setLabel(option.name.charAt(0).toUpperCase() + option.name.slice(1))
                .setValue(option.name);
            if (option.description.length > 0)
                optionsFormated.setDescription(option.description);
            this.selectMenu.addOptions(optionsFormated);
        });
    }

    getSelector() {
        return this.selectMenu;
    }

}

export default SelectorMenu