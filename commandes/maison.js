import { EmbedBuilder } from "discord.js";
import { Repository } from "../repository/repository.js";

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
export async function newHouseCup(channel, points) {
  //Pour chaque maisons on créé un message
  //Un passage en base de données pourrait être intéressant pour stabiliser le bot
  const myRepository = new Repository();
  const maisons = await myRepository.getMaisons(channel);

  if (maisons[0]) {
    for (let i = 0; i < maisons.length; i++) {
      const messageId = maisons[i].messageId;
      let point = 0;

      //Si les points sont bien renseigné
      if (points && points.length == maisons.length) {
        point = parseInt(points[i]);
      }
      //On constuit le nouveau message
      const embed = new EmbedBuilder()
        .setColor(maisons[i].couleur)
        .setTitle(maisons[i].nom)
        .setThumbnail(maisons[i].blason)
        .setDescription(point.toString());

      //On envois le message
      let message = await channel.send({ embeds: [embed] });

      //On met à jour les données du bot
      const newMaison = maisons[i];
      newMaison.messageId = message.id;
      //await myRepository.updateHouse(channel, messageId, newMaison);
    }
  }
}
