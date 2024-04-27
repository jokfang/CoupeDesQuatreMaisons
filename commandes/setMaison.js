import { EmbedBuilder } from "discord.js";
import { HouseRepository } from "../repository/houseRepository.js";

export async function setBlason(houseName, image, channel) {
  const houseRepos = new HouseRepository();
  const maison = await houseRepos.getMaison(houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);
  maison.blason = image;
  //await houseRepos.updateHouse(channel, maison.messageId, maison);

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
  const houseRepos = new HouseRepository();
  const maison = await houseRepos.getMaison(houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);

  maison.nom = nom;
  //await houseRepos.updateHouse(channel, maison.messageId, maison);

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
  const houseRepos = new HouseRepository();
  const maison = await houseRepos.getMaison(houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);

  maison.couleur = couleur;
  //await houseRepos.updateHouse(channel, maison.messageId, maison);

  //On construit le message qui sera appliqué en annule et remplace du précédent
  const embed = new EmbedBuilder()
    .setColor(maison.couleur)
    .setTitle(maison.nom)
    .setThumbnail(maison.blason)
    .setDescription(cpt.toString());
  //On édit le message
  msg.edit({ embeds: [embed] });
}
