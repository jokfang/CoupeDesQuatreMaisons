import { EmbedBuilder } from "discord.js";
import { Repository } from "../repository/repository.js";

export async function setPoint(houseName, montant, channel) {
  const myRepository = new Repository();
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(montant);

  if (cpt < 0) {
    cpt = 0;
  }

  //On construit le message qui sera appliqué en annule et remplace du précédent
  const embed = new EmbedBuilder()
    .setColor(maison.couleur)
    .setTitle(maison.nom)
    .setThumbnail(maison.blason)
    .setDescription(cpt.toString());
  //On édit le message
  msg.edit({ embeds: [embed] });
}

//Retire des points à une maison en prenant son id et le montant de point à retirer
export async function removePoint(houseName, montant, message) {
  let maison;
  const myRepository = new Repository();
  if (houseName.substring(0, 2) == "<@") {
    const maisons = await myRepository.getMaisons(message.channel);
    let member = message.mentions.members.first();
    houseName = maisons.find((house) =>
      member._roles.find((memberRole) => memberRole == house.roleId)
    ).nom;
    maison = await maisons.find((house) => house.nom == houseName);
  } else {
    maison = await myRepository.getMaison(message.channel, houseName);
  }
  const msg = await message.channel.messages.fetch(maison.messageId);

  //On décrémente le compteur
  let cpt = parseInt(msg.embeds[0].data.description);
  cpt -= parseInt(montant);

  if (cpt < 0) {
    cpt = 0;
  }

  //On construit le message qui sera appliqué en annule et remplace du précédent
  const embed = new EmbedBuilder()
    .setColor(maison.couleur)
    .setTitle(maison.nom)
    .setThumbnail(maison.blason)
    .setDescription(cpt.toString());
  //On édit le message
  msg.edit({ embeds: [embed] });
}

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
export async function addPoint(houseName, montant, message) {
  let maison;
  const myRepository = new Repository();
  if (houseName.substring(0, 2) == "<@") {
    const maisons = await myRepository.getMaisons(message.channel);
    let member = message.mentions.members.first();
    houseName = maisons.find((house) =>
      member._roles.find((memberRole) => memberRole == house.roleId)
    ).nom;
    maison = await maisons.find((house) => house.nom == houseName);
  } else {
    maison = await myRepository.getMaison(message.channel, houseName);
  }
  const msg = await message.channel.messages.fetch(maison.messageId);

  //On incrémente le compteur
  let cpt = parseInt(msg.embeds[0].data.description);
  cpt += parseInt(montant);

  //On construit le message qui sera appliqué en annule et remplace du précédent
  const embed = new EmbedBuilder()
    .setColor(maison.couleur)
    .setTitle(maison.nom)
    .setThumbnail(maison.blason)
    .setDescription(cpt.toString());
  //On édit le message
  msg.edit({ embeds: [embed] });
}
