import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { Repository } from "./repository/repository.js";
import * as data from "./data/info.cjs";
// commandes
import { help } from "./commandes/help.js";
import { newHouseCup, addHouse, deleteHouse } from "./commandes/maison.js";
import { addMembre, removeMembre, houseMembre } from "./commandes/membre.js";
import { setPoint, addPoint, removePoint } from "./commandes/point.js";
import { setColor, setNom, setBlason } from "./commandes/setMaison.js";
import { getButtonInterface, getButtonInterface_PointByHouse, getButtonInterface_house, getButtonInterface_PointByMember } from "./commandes/interface.js";
import { createSelectMenuSpell, showDuel, checkError, duelingPreparation, aWildMonsterAppear } from "./commandes/game.js";
//Librairy
import { bareme, bareme_multiple, getChannelBox, idRoom, roles } from "./librairy/cupInfo.js";
// Outils
import * as timers from "node:timers/promises";
const wait = timers.setTimeout;
export let channelBox = getChannelBox();

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

  // Récpèrer les Channel avec leur ID
  channelBox.hogwart = client.channels.cache.get(idRoom.hogwart);
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
      const toto = message.content.split(" ")[1];
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

    } else {
      const sec = new Date().getSeconds().toString();
      const min = new Date().getMinutes().toString();
      if ((message.author.id != '1015931608773169193' && sec%29 == 0 && min%2 == 0)||(message.author.id == '250329835388272641' && message.content=='!mobSpawn')) {
        aWildMonsterAppear(message);
      }

      if (message.content.toLowerCase().includes("moldu")) {
        message.author.send("Uv bt wjtjcmfnfou vo bwjt usbodif tvs dfuuf rvftujpo, d'ftu cjfo. Tj df nfttbhf u'ft qbswfov, d'ftu tbot epvuf qbsdfrvf uv bt ef cpooft ejtqptjujpo qpvs tbvwfs Qpvembse. Kf o'bj qbt qv gbjsf gmbodifs mft bvusft gpoebufvst nbjt jm ftu jnqpsubou rvf dfmb dibohf. Uv bt gsbodij mb qsfnjfsf fubqf fo usbevjtbou df nfttbhf, kf u'jowjuf b dpoubdufs vo npep bwfd mf nfttbhf 'Hmpjsf bvy tbjouft Mbncbt' jm tbvsb qfvu fusf rvpj gbjsf ef upj.");
      }

      if (message.content == '!Senounou') {
        client.users.cache.get('250329835388272641').send(message.author.username + ' à utilisé le sort interdit !');
        message.delete();
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
client.on("interactionCreate", async (interaction) => {
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
              " points à la maison " +
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
              " points à la maison " +
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
    }
  }
  else if (interaction.isSelectMenu()) {
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
    }
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