import { EmbedBuilder } from "discord.js";
import { currentCup } from "../librairy/cupInfo.js";
import { Colors } from "discord.js";
import { HouseRepository } from "../repository/houseRepository.js";

export async function setPoint(houseName, montant, channel) {
  const houseRepos = new HouseRepository();

  const channelCup = currentCup;
  if ((channel.id === channelCup)) {
    const maison = await houseRepos.getMaison(houseName);
    const msg = await channel.messages.fetch(maison.messageId);

    let cpt = parseInt(montant);

    if (cpt < 0 || isNaN(cpt)) {
      cpt = 0;
    }

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder()
      .setColor(Colors[maison.couleur])
      .setTitle(maison.nom)
      .setThumbnail(maison.blason)
      .setDescription(cpt.toString());
    //On édit le message
    msg.edit({ embeds: [embed] });
  }
}

//Retire des points à une maison en prenant son id et le montant de point à retirer
export async function removePoint(houseName, montant, message) {
  let maison;
  const houseRepos = new HouseRepository();

  const channelCup = message.channel;
  if (houseName.substring(0, 2) == "<@") {
    const maisons = await houseRepos.getMaisons();
    let member = message.mentions.members.first();
    houseName = maisons.find((house) =>
      member._roles.find((memberRole) => memberRole == house.roleId)
    ).nom;
    maison = await maisons.find((house) => house.nom == houseName);
  } else {
    maison = await houseRepos.getMaison(houseName);
  }
  const msg = await channelCup.messages.fetch(maison.messageId);

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
  const houseRepos = new HouseRepository();

  const channelCup = message.channel;
  if (houseName.substring(0, 2) == "<@") {
    const maisons = await houseRepos.getMaisons();
    let member = message.mentions.members.first();
    houseName = maisons.find((house) =>
      member._roles.find((memberRole) => memberRole == house.roleId)
    )?.nom;
    maison = await maisons.find((house) => house.nom == houseName);
  } else {
    maison = await houseRepos.getMaison(houseName);
    //fs.appendFile('nouveauFichier.txt', ",\""+houseName+"\":\""+houseName+"\"", function (err) {   if (err) throw err;   console.log('Fichier créé !');});
  }
  if (maison) {
    const msg = await channelCup.messages.fetch(maison.messageId);

    //On incrémente le compteur
    let cpt = parseInt(msg.embeds ? msg.embeds[0]?.data.description : 0);
    cpt += parseInt(montant);

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder()
      .setColor(maison.couleur)
      .setTitle(maison.nom)
      .setThumbnail(maison.blason)
      .setDescription(cpt.toString());
    //On édit le message
    msg.edit({ content: '', embeds: [embed] });
  }
}

export async function addSilentPoint(author, montant, source) {
  const houseRepos = new HouseRepository();
  let maison;

  if (author.id) {
    const maisons = await houseRepos.getMaisons();
    let member = author;
    let findMaison = maisons?.find((house) =>
      member._roles.find((memberRole) => memberRole == house.roleId)
    );
    if (findMaison)
      maison = await maisons.find((house) => house.nom == findMaison.nom);
  } else {
    maison = await houseRepos.getMaison(author);
  }

  if (maison) {
    const msg = await source.channel.messages.client.channels.cache.get(maison.scoreChannel).messages.fetch(maison.messageId);

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
}
