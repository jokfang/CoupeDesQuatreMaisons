import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { Point } from "./commandes/point.js";
import { help } from "./commandes/help.js";
//import {newHouseCup} from './commandes/maison.js'
import { Repository } from "./repository/repository.js";
import * as data from "./data/info.cjs";

//Droit attribué au bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
});
// MTAxNjc5NzY3MzE3ODc5MjA3Ng.GTnOz-.WriQ334pUwFn3d7QAMfoH1aaugbRnovoa1ZWbw
const token = data.default.token;

//Connexion du bot
client.once("ready", () => {
  console.log("Félicitations, votre bot est ok !");
});
client.login(token);

//Création de l'accès à la BDD
const myRepository = new Repository();

//Lorsqu'on reçoit un message:
client.on("messageCreate", async function (message) {
  try {
    console.log(message.content);
    let isOK = true;

    isOK = checkMessage(message.content);
    if (message.content.split(" ")[0] === "!add" && isOK) {
      const toto = message.content.split(" ")[1];
      if (!isNaN(message.content.split(" ")[1])) {
        //On ajoute les points en modifiant le message, puis on supprime la commande
        addPoints(
          message.content.split(" ")[3],
          parseInt(message.content.split(" ")[1]),
          message
        );
      } else if (message.content.split(" ")[1].substring(0, 2) == "<@") {
        //On ajoute le membre à la maison
        addMembre(message.content.split(" ")[3], message);
      }
      message.delete();
    } else if (message.content.split(" ")[0] === "!remove" && isOK) {
      if (!isNaN(message.content.split(" ")[1])) {
        //On retire les points en modifiant le message, puis on supprime la commande
        removePoint(
          message.content.split(" ")[3],
          parseInt(message.content.split(" ")[1]),
          message
        );
      } else if (message.content.split(" ")[1].substring(0, 2) == "<@") {
        //On retire le membre de la maison
        removeMembre(message.content.split(" ")[3], message);
      }
      message.delete();
    } else if (message.content.split(" ")[0] === "!setBlason" && isOK) {
      //On modifie le blason, puis on supprime la commande
      setBlason(
        message.content.split(" ")[3],
        message.content.split(" ")[1],
        message.channel
      );
      message.delete();
    } else if (message.content.split(" ")[0] === "!setNom" && isOK) {
      //On modifie le nom, puis on supprime la commande
      setNom(
        message.content.split(" ")[3],
        message.content.split(" ")[1],
        message.channel
      );
      message.delete();
    } else if (message.content.split(" ")[0] === "!setPoint" && isOK) {
      //On attribue les points en modifiant le message, puis on supprime la commande
      setPoint(
        message.content.split(" ")[3],
        parseInt(message.content.split(" ")[1]),
        message.channel
      );
      message.delete();
    } else if (message.content.split(" ")[0] === "!setCouleur" && isOK) {
      //On attribue la couleur en modifiant le message, puis on supprime la commande
      setColor(
        message.content.split(" ")[3],
        message.content.split(" ")[1],
        message.channel
      );
      message.delete();
    } else if (message.content.split(" ")[0] === "!newHouseCup" && isOK) {
      //Si les points sont renseigné on envois les points, sinon on créé les messages avec 0 points
      if (message.content.split(" ").length > 1) {
        newHouseCups(message.channel, message.content.split(" ")[1].split("."));
      } else {
        newHouseCups(message.channel);
      }
      message.delete();
    } else if (message.content.split(" ")[0] === "!addHouse" && isOK) {
      //Si les points sont renseigné on envois les points, sinon on créé les messages avec 0 points
      if (message.content.split(" ").length == "1") {
        addHouse(message.channel);
      } else if (message.content.split(" ").length == "2") {
        addHouse(message.channel, message.content.split(" ")[1]);
      } else if (message.content.split(" ").length == "3") {
        addHouse(
          message.channel,
          message.content.split(" ")[1],
          "",
          message.content.split(" ")[2]
        );
      } else if (message.content.split(" ").length == "4") {
        addHouse(
          message.channel,
          message.content.split(" ")[1],
          message.content.split(" ")[3],
          message.content.split(" ")[2]
        );
      }
      message.delete();
    } else if (message.content.split(" ")[0] === "!removeHouse" && isOK) {
      //Supprime une maison en utilisant son nom
      deleteHouse(message, message.content.split(" ")[1]);

      message.delete();
    } else if (message.content.split(" ")[0] === "!houseCupHelp" && isOK) {
      //Si les points sont renseigné on envois les points, sinon on créé les messages avec 0 points
      help(message.channel);
      message.delete();
    }
  } catch (error) {
    await message.channel.send(
      "Une erreur a été rencontré, tu peux supprimer ce message et ton appel (ou le montrer à un dév) et retenter"
    );
    console.log(error.message);
  }
});

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
async function addPoints(houseName, montant, message) {
  let maison;
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

//Retire des points à une maison en prenant son id et le montant de point à retirer
async function removePoint(houseName, montant, message) {
  let maison;
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

async function setBlason(houseName, image, channel) {
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);
  maison.blason = image;
  await myRepository.updateHouse(channel, maison.messageId, maison);

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

async function setNom(houseName, nom, channel) {
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);

  maison.nom = nom;
  await myRepository.updateHouse(channel, maison.messageId, maison);

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

async function setColor(houseName, couleur, channel) {
  const maison = await myRepository.getMaison(channel, houseName);
  const msg = await channel.messages.fetch(maison.messageId);

  let cpt = parseInt(msg.embeds[0].data.description);

  maison.couleur = couleur;
  await myRepository.updateHouse(channel, maison.messageId, maison);

  //On construit le message qui sera appliqué en annule et remplace du précédent
  const embed = new EmbedBuilder()
    .setColor(maison.couleur)
    .setTitle(maison.nom)
    .setThumbnail(maison.blason)
    .setDescription(cpt.toString());
  //On édit le message
  msg.edit({ embeds: [embed] });
}

async function setPoint(houseName, montant, channel) {
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

async function addMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();
  const maisons = await myRepository.getMaisons(message.channel);
  if (
    !maisons.find((maison) =>
      member._roles.find((memberRole) => memberRole == maison.roleId)
    )
  ) {
    member.roles.add(role);
  }
}

async function removeMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();

  member.roles.remove(role);
}

async function newHouseCups(channel, points) {
  //Pour chaque maisons on créé un message
  //Un passage en base de données pourrait être intéressant pour stabiliser le bot
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

async function addHouse(channel, houseName, blason, couleur) {
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
  await myRepository.addHouse(
    channel,
    houseName,
    blason,
    couleur,
    messageId,
    role.id
  );
}

async function deleteHouse(message, houseName) {
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

function checkMessage(message) {
  message = message + "";
  if (message.substring(0, 1) != "!") {
    return false;
  }
  if (message.split(" ").length == 4) {
    //if(!data.default.maisons.find(element => element.nom == message.split(' ')[3])){
    //    return false;
    //}
  }

  return true;
}
