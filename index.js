import { Client, GatewayIntentBits, Events } from "discord.js";
import { Repository } from "./repository/repository.js";
import * as data from "./data/info.cjs";
// commandes
import { help } from "./commandes/help.js";
import { addMembre, removeMembre, houseMembre } from "./commandes/membre.js";
import { setPoint, addPoint, removePoint, addSilentPoint } from "./commandes/point.js";
import { setColor, setNom, setBlason } from "./commandes/setMaison.js";
import { getButtonInterface, getButtonInterface_PointByHouse, getButtonInterface_house } from "./commandes/interface.js";
import { createSelectMenuSpell, showDuel, checkError, duelingPreparation } from "./commandes/game.js";
import { newHouseCup } from "./commandes/maison.js";
import { encouragement } from "./commandes/message.js";
import { simpleDice } from "./commandes/items.js";
//Librairy
import { bareme, bareme_multiple, roles } from "./librairy/cupInfo.js";
// Outils
import * as timers from "node:timers/promises";
import { Monster } from "./class/monster.js";
import { specialAction } from "./class/specialAction.js";
import { useItem } from "./class/useItem.js";
import { Raid } from "./class/raid.js";
const wait = timers.setTimeout;

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

    isOK = checkMessage(message);
    if (message.content.split(" ")[0] === "!add" && isOK) {
      if (!isNaN(message.content.split(" ")[1])) {
        //On ajoute les points en modifiant le message, puis on supprime la commande
        addPoint(
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
        newHouseCup(message.channel, message.content.split(" ")[1].split("."));
      } else {
        newHouseCup(message.channel);
      }
      message.delete();
    } else if (message.content.split(" ")[0] === "!bouton" && isOK) {
      // Ouvre l'interface des boutons
      getButtonInterface(message);
      message.delete();
    } else if (message.content.split(" ")[0] === "!helpHouseCup") {
      //Si les points sont renseigné on envois les points, sinon on créé les messages avec 0 points
      help(message);
      message.delete();
    } else if (message.content.split(" ")[0] === "!duel") {
      const duelStatus = "attack";
      const houseChallenger = await houseMembre(message.member);
      const houseOpponent = await houseMembre(message.mentions.members.first());
      if (await checkError(message, duelStatus, false, false, houseChallenger, houseOpponent)) {
        await createSelectMenuSpell(message, houseChallenger.id, duelStatus);
      }
      message.delete();

    } else if (message.content.split(" ")[0] === "!dé") {
      if (message.content.split(" ").length > 1) {
        message.reply(simpleDice(1, message.content.split(" ")[1]).toString());
      } else {
        message.reply(simpleDice(1, 6).toString());
      }
    } else if (message.content.split(" ")[0] === "!raid") {
      const list = message.content.split(" ").length > 1 ? message.content.split(" ")[1].toLowerCase() : "default"
      new Raid(message).createRaid(list);    
     } else {
      const sec = new Date().getSeconds().toString();
      const min = new Date().getMinutes().toString();
      if ((message.author.id != '1015931608773169193' && sec%29 == 0 && min%2 == 0)||(message.author.id == '250329835388272641' && message.content=='!mobSpawns')) {
        new Monster(message).aWildMonsterAppear();
      }
      else if (['935671117748764733', '937155308642513007', '935673157635964959'].includes(message.channel.id) && message.content.length > 200){
        addSilentPoint(message.member, 5, message);
      } else if (await encouragement(message.content) == true) {
        addSilentPoint(message.member, 1, message);
      }
    }
  } catch (error) {
    await message.channel.send(
      "Une erreur a été rencontré, tu peux supprimer ce message et ton appel (ou le montrer à un dév) et retenter"
    );
    console.log(error.message);
  }
});

//Lorsqu'on reçoit une interaction (Bouton, Select menu,...)
client.on(Events.InteractionCreate, async (interaction) => {
  //Droit Modération
  const moderationRoleByInteraction =
    interaction.message.member._roles.find(
      (memberRole) => memberRole == roles.administrateur
    ) ||
    interaction.message.member._roles.find(
      (memberRole) => memberRole == roles.moderateur
    );

  if (interaction.isButton()) {
    if (moderationRoleByInteraction) {
      let point;
      switch (interaction.customId.split("_")[0]) {
        case "interfacePointByHouse":
          getButtonInterface_PointByHouse(interaction);
          break;
        case "interfacePointByMember":
          //getButtonInterface_PointByMember(interaction);
          interaction.reply({
            content: "Cette interface est encore en construction.",
            ephemeral: true,
          });
          break;
        case "interfacePoint":
          getButtonInterface_house(
            interaction,
            interaction.customId.split("_")[1]
          );
          break;
        case "interfaceExit":
          interaction.message.delete();
          break;
        case "add":
          point = bareme[interaction.customId.split("_")[2]];

          addPoint(interaction.customId.split("_")[1], point);
          interaction.reply({
            content:
              "Vous avez ajoutée " +
              point +
              " points au clan " +
              interaction.customId.split("_")[1],
            ephemeral: false,
          });
          wait(10);
          interaction.deleteReply();
          break;
        case "addMultiple":
          point =
            bareme_multiple[
            interaction.customId.split("_")[2] +
            "_" +
            interaction.customId.split("_")[3]
            ];

          addPoint(interaction.customId.split("_")[1], point);
          interaction.reply({
            content:
              "Vous avez ajoutée " +
              point +
              " points au clan " +
              interaction.customId.split("_")[1],
            ephemeral: false,
          });
          wait(10);
          interaction.deleteReply();
          break;
        default:
      }
    }
    switch (interaction.customId.split("_")[0]) {
      case "contreDuel":
        const duelStatus = "counter";
        if (await checkError(interaction, duelStatus)) {
          const houseOpponent = await houseMembre(interaction.message.member);
          createSelectMenuSpell(interaction, houseOpponent.id, duelStatus);
        }
        break;
      case "contreMonsters":
        new Monster(interaction).counterMonstre();
        interaction.deferUpdate();
        break;
      case "contreRaid":
        new Raid(interaction).counterMonstre();
        interaction.deferUpdate();
        break;
      case "specialAction":
        new specialAction(interaction).sendPannel();
        break;
    }
  }
  else if (interaction.isStringSelectMenu()) {
    if (interaction.customId.split("_")[1] === "spell") {
      const dataSelectMenu = interaction.values[0];
      const duelStatus = interaction.customId.split("_")[2];

      if (interaction.customId.split("_")[2] == "attack") {
        if (await checkError(interaction, duelStatus, interaction.customId.split("_")[1], interaction.values[0].split("_")[1])) {
          showDuel(interaction, dataSelectMenu, duelStatus);
        }
      }
      else if (interaction.customId.split("_")[2] == "counter") {
        if (await checkError(interaction, duelStatus, interaction.customId.split("_")[1], interaction.values[0].split("_")[2])) {
          duelingPreparation(interaction, dataSelectMenu, duelStatus)
        }
      }
    } else if (interaction.customId == 'selectAction') {
      new specialAction(interaction).setAction();
    }
  } else if (interaction.isModalSubmit()) {
    new useItem(interaction).useThis();
  }
});

function checkMessage(message) {
  let messageContent = message.content + "";
  if (!messageContent.startsWith("!")) {
    return false;
  }
  if (message?.webhookId == "1021509750321586236") {
    return true;
  }
  // Droit Modération
  const moderationRoleByMessage = message.member._roles.find((memberRole) =>
    [roles.administrateur, roles.moderateur, roles.BOT].includes(memberRole)
  );
  if (!moderationRoleByMessage) {
    return false;
  }
  if (messageContent.substring(0, 1) != "!") {
    return false;
  }

  return true;
}

export function sendToJokfang(message) {
  client.users.cache.get('250329835388272641').send(message);
}