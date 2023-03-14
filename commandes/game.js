import * as Discord from "discord.js";
import { houseMembreDuel } from "../commandes/membre.js";
import { duelDescription } from "../type/duelParam.class.js";
import { SpellSelect } from "../class/spellSelect.js";
import { WaitingDuelMessage } from "../class/waitingDuelMessage.js";
import { Duel } from "../class/duel.js";
import { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder } from "discord.js";
import { idRoom, bareme } from "../librairy/cupInfo.js";

export async function createDataDuel(message, dataSelectMenu, duelStatus) {
  let dataDuelInit = await Object.create(duelDescription);
  await dataDuelInit.create(message, dataSelectMenu, duelStatus);

  const dataDuel = await houseMembreDuel(dataDuelInit);
  return dataDuel;
}

export async function createSelectMenuSpell(message, idHousePlayer, duelStatus) {
  const spellSelect = new SpellSelect(message, { duelStatus: duelStatus });
  if (duelStatus == 'attack') { 
      return spellSelect.sendAttackSelect();  
  } else if (duelStatus == 'counter') {
      return spellSelect.sendCounterSelect();
    }
}

export async function showDuel(interaction, dataSelectMenu, duelStatus) {
  const dataDuel = await createDataDuel(interaction, dataSelectMenu, duelStatus);
  const waitingDuelMessage = new WaitingDuelMessage(dataDuel);
  waitingDuelMessage.sendWaitingDuelMessage(interaction);
}

export async function duelingPreparation(interaction, dataSelectMenu, duelStatus) {
  const messageDuel = await interaction.message.fetchReference();
  const dataDuel = await createDataDuel(messageDuel, dataSelectMenu, duelStatus);

  if (dataDuel) {
    duel(messageDuel, dataDuel, interaction);
  }
}

export async function duel(messageDuel, dataDuel, interaction) {
  const duel = new Duel(dataDuel, messageDuel);
  duel.resolveDuel(interaction);
}

// Function qui vérifie tout les erreurs possibles.
//Attention le paramètre message, peu être aussi un messageInteraction.
export async function checkError(message, duelStatus, status, selectMenuData_id, houseChallenger, houseOpponent) {
  if (!message.content) {
    message.message.author = message.member;
    message = message.message;
  }
  if (duelStatus === "attack") {
    // Vérifie si c'est bien le challenger qui choisis le sort.
    if (status === "spell") {

      const idChallenger = message.member.id;
      const idChallengerDuel = selectMenuData_id;

      if (idChallenger === idChallengerDuel) {
        return true;
      } else {
        message.reply({ content: "Vous ne pouvez pas choisir l'attaque de quelqu'un d'autre.", ephemeral: true })
        return false;
      }
    }
    // Vérifie si l'Oppossant à une maison ou bien qu'il n'est pas dans celle du challenger.
    else {
      if (!houseOpponent.id) {
        await message.author.send("Votre cible ne possède pas de maison.");
      }
      else if (houseChallenger.id === houseOpponent.id) {
        await message.author.send("Vous ne pouvez pas attaquer un membre de votre maison ou bien vous-même.")
      }
      else {
        return true;
      }
    }
    return false;
  }

  else if (duelStatus === "counter") {
    if (status === "spell") {
      // Vérifie si celui qui choisi l'attaque est bien celui qui contre.
      const idOpponent = message.member.id;
      const idOpponentDuel = selectMenuData_id;

      if (idOpponent === idOpponentDuel) {
        return true;
      } else {
        message.reply({ content: "Vous ne pouvez pas choisir l'attaque de quelqu'un d'autre.", ephemeral: true })
        return false;
      }
    } else {
      // Vérifie si celui qui contre est bien le bon adversaire.
      let duelMessage
      duelMessage = message.reference ? await message.fetchReference() : message;
      const idOpponent = message.member.id;

      const duelDescription = duelMessage.embeds[0].description;
      const start = duelDescription.lastIndexOf("<@") + 2;
      const end = duelDescription.lastIndexOf("> ");
      const idOpponentDuel = duelDescription.substring(start, end);

      if (idOpponent === idOpponentDuel || duelDescription == 'Une créature apparait, capturez là') {
        if (duelDescription == 'Une créature apparait, capturez là') {
            return true;
          
        } else {
          return true;
        }
      } else {
        await message.author.send("Vous n'êtes pas l'adversaire attendu du duel en cours.")
        return false;
      }
    }
  }
}

export async function aWildMonsterAppear(message) {
    const embedTitle = "Une créature apparait !";

    const duelMessage =
      "Une créature apparait, capturez là";
  
    //Créer le message et l'envoyer*
    const embedShowDuel = new Discord.EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle(embedTitle)
      .setDescription(duelMessage)
      .setThumbnail('https://media.tenor.com/hFI8kPSHEk8AAAAM/niffler-fantastic.gif');

    await message.channel.messages.client.channels.cache.get('1064843417663844363').send({ embeds: [embedShowDuel], components:[new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("contreMonster")
        .setLabel("Capture")
      .setStyle(ButtonStyle.Primary))]
    }).then(msg => setTimeout(() => msg.delete(), 600000));
}

export async function counterMonstre(interraction) {
  const embed = interraction.message.embeds[0];
  const embedsEdited = new EmbedBuilder()
    .setColor(embed.color)
    .setTitle(embed.title)
    .setDescription(embed.description)
    .setThumbnail(embed.thumbnail.url);
  let edited = false;
  if (embed.fields.length && !embed.fields[0]?.value.includes('<@' + interraction.member + '>')) {
    embedsEdited.addFields({ name: 'Captures', value: embed.fields[0].value + ', <@' + interraction.member + '>', inline: true });
    edited = true;
  }
  else if(!embed.fields.length){   
    embedsEdited.addFields({ name: 'Capture', value: '<@' + interraction.member + '>', inline: true });
    interraction.message.edit({ embeds: [embedsEdited] });
    edited = true;
  }

  if (edited) {
    interraction.message.edit({ embeds: [embedsEdited] });
    const cptChannel = interraction.message.client.channels.cache.get(idRoom.hogwart);
    cptChannel.send("!add " + (bareme.duel/2).toString() + " to <@" + interraction.member + '>');
  }
}