import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import * as data from "./data/info.cjs";
import { showDuel, counter, createDataDuel } from "./commandes/game.js";
import { help } from "./commandes/help.js";
import { newHouseCup, addHouse, deleteHouse } from "./commandes/maison.js";
import { addMembre, removeMembre } from "./commandes/membre.js";
import { setPoint, addPoint, removePoint } from "./commandes/point.js";
import { setColor, setNom, setBlason } from "./commandes/setMaison.js";
import { getChannelBox, idRoom } from "./librairy/cupInfo.js";
import { Repository } from "./repository/repository.js";
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
  channelBox.commandChannel = client.channels.cache.get(idRoom.commandChannel);
  channelBox.maison = client.channels.cache.get(idRoom.maison);
  channelBox.ohana = client.channels.cache.get(idRoom.ohana);
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
    } else if (message.content.split(" ")[0] === "!helpHouseCup" && isOK) {
      //Si les points sont renseigné on envois les points, sinon on créé les messages avec 0 points
      help(message);
      message.delete();
    } else if ((message.content.split(" ")[0] === "!attaque") && isOK) {
        const dataDuel = await createDataDuel(message);
        showDuel(dataDuel, message);
        
    } else if (message.content.split(" ")[0] === "!contre" && isOK){
      const opponent = message.member.displayName;
      const spell = message.content.split(" ")[1];
      if (spell != undefined) {
        counter(message, opponent, spell);
      } else {
        await message.channel.send("Vous n'avez pas rentrée de sort, ou il n'a pas réussi à étre lu.");
      }
    } 
  } catch (error) {
    await message.channel.send(
      "Une erreur a été rencontré, tu peux supprimer ce message et ton appel (ou le montrer à un dév) et retenter"
    );
    console.log(error.message);
  }
});

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

  
