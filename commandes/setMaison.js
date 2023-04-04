import { EmbedBuilder } from "discord.js";
import { Repository } from "../repository/repository.js";

export async function setBlason(houseName, image, channel) {
  const myRepository = new Repository();
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);
  maison.blason = image;
  //await myRepository.updateHouse(channel, maison.messageId, maison);

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

export async function setNom(houseName, nom, channel) {
  const myRepository = new Repository();
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);

  maison.nom = nom;
  //await myRepository.updateHouse(channel, maison.messageId, maison);

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

export async function setColor(houseName, couleur, channel) {
  const myRepository = new Repository();
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);

  maison.couleur = couleur;
  //await myRepository.updateHouse(channel, maison.messageId, maison);

  //On construit le message qui sera appliqué en annule et remplace du précédent
  const embed = new EmbedBuilder()
    .setColor(maison.couleur)
    .setTitle(maison.nom)
    .setThumbnail(maison.blason)
    .setDescription(cpt.toString());
  //On édit le message
  msg.edit({ embeds: [embed] });
}
