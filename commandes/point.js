import {EmbedBuilder} from 'discord.js';

export class Point{
    constructor() {}
    //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
    async addPoint(maison, montant, channel){
        const messageId = maison.messageId;
        const msg = await channel.messages.fetch(messageId);

        //On incrémente le compteur
        let cpt = parseInt(msg.embeds[0].data.description);
        cpt += montant;

        //On construit le message qui sera appliqué en annule et remplace du précédent
        const embed = new EmbedBuilder().setColor(maison.couleur)
            .setTitle(maison.nom)
            .setThumbnail(maison.blason)
            .setDescription(cpt.toString());
        //On édit le message
        msg.edit({embeds: [embed]});

        return maison;
    }
}