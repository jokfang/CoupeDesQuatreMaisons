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
      await myRepository.updateHouse(channel, messageId, newMaison);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      addHouse(channel, "Maison" + i.toString(), "", "0x0066ff");
    }
  }
}

export async function addHouse(channel, houseName, blason, couleur) {
  if (!houseName) {
    houseName = "RenommeMoi";
  }
  if (!blason) {
    blason =
      "https://www.sticker-blason.com/images/imageshop/produit/2017/05/m_592d833d86daa7.46097717.jpeg";
  }
  if (!couleur) {
    couleur = "0x0066ff";
  }

  const embed = new EmbedBuilder()
    .setColor(couleur)
    .setTitle(houseName)
    .setThumbnail(blason)
    .setDescription("0");

  const messageId = (await channel.send({ embeds: [embed] })).id;
  const role = await channel.guild.roles.create({
    name: houseName,
    color: couleur,
  });

  const myRepository = new Repository();
  await myRepository.addHouse(
    channel,
    houseName,
    blason,
    couleur,
    messageId,
    role.id
  );
}

export async function deleteHouse(message, houseName) {
  const myRepository = new Repository();
  const maison = await myRepository.getMaison(message.channel, houseName);
  if (maison) {
    myRepository.deleteMaison(maison.messageId);
    //delete role
    const role = await message.guild.roles.cache.get(maison.roleId);
    if (role) {
      role.delete();
    }
    //delete message
    const msg = await message.channel.messages.fetch(maison.messageId);
    if (msg) {
      msg.delete();
    }
  }
}
