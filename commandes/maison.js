import {EmbedBuilder} from 'discord.js';

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
export async function newHouseCup(channel, points){
    //Pour chaque maisons on créé un message
    //Un passage en base de données pourrait être intéressant pour stabiliser le bot
    for (let i = 0; i < houses.default.maisons.length; i++){
        let point = 0;

        //Si les points sont bien renseigné
        if (points && points.length == houses.default.maisons.length) {
            point = parseInt(points[i]);
        }
        //On constuit le nouveau message
        let embed = new EmbedBuilder().setColor(houses.default.maisons[i].couleur)
        .setTitle(houses.default.maisons[i].nom)
        .setThumbnail(houses.default.maisons[i].blason)
        .setDescription(point.toString());

        //On envois le message
        let message = await channel.send({embeds: [embed]});

        //On met à jour les données du bot
        houses.default.maisons[i].messageId = message.id;
        houses.default.maisons[i].number = i;
    }
}
