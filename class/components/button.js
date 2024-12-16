import { ButtonBuilder, ButtonStyle } from "discord.js";

const styles = {
    'Primary': ButtonStyle.Primary,
    'Blue': ButtonStyle.Primary,
    'Secondary ': ButtonStyle.Secondary,
    'Grey': ButtonStyle.Secondary,
    'Success': ButtonStyle.Success,
    'Green': ButtonStyle.Success,
    'Danger': ButtonStyle.Danger,
    'Red': ButtonStyle.Danger,
    'Link': ButtonStyle.Link
}

export class Button {
    constructor(param) {
        this.button = new ButtonBuilder()
            .setCustomId(param.id)
            .setLabel(param.label)
            .setStyle(styles[param.style])
    }

    setEmojie(emojie) {
        this.button.setEmojie(emojie);
    }

    getButton() {
        return this.button;
    }
}

export default Button