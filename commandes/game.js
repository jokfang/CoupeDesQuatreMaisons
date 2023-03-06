import * as Discord from "discord.js";
import { idRoom, bareme } from "../librairy/cupInfo.js";
import { getRandomInt } from "../commandes/items.js";
import { addPoint, removePoint } from "../commandes/point.js";
import { houseMembreDuel } from "../commandes/membre.js";
import * as dataGames from "../librairy/game.cjs";
import { Repository } from "../repository/repository.js";
import { SpellRepository } from "../repository/spellRepository.js";
import { duelDescription } from "../type/duelParam.class.js";
import { ButtonStyle } from "discord.js";
import { SpellSelect } from "../class/spellSelect.js";

export async function createDataDuel(message, dataSelectMenu, duelStatus) {
  let dataDuelInit = await Object.create(duelDescription);
  await dataDuelInit.create(message, dataSelectMenu, duelStatus);

  const dataDuel = await houseMembreDuel(dataDuelInit);
  return dataDuel;
}

export async function createSelectMenuSpell(message, idHousePlayer, duelStatus) {
  if (message.content) { 
    const mySpellRepository = new SpellRepository();
    const spells = await mySpellRepository.getSpellsOfHouse(message.channel, idHousePlayer);
    let idChallenger;
    let idOpponent;

    if (duelStatus == "attack") {
      idChallenger = message.member.id;
      idOpponent = message.mentions.members.first().id;
    } else if (duelStatus == "counter") {
      idOpponent = message.member.id;
      idChallenger = "null";
    }
    if (spells) {
      const list = new Discord.SelectMenuBuilder()
        .setCustomId('selectMenu_spell_' + duelStatus)
        .setPlaceholder('Sort non sélectionné')
      for (let i = 0; i < spells.length; i++) {
        list.addOptions(
          {
            label: spells[i].spellName.charAt(0).toUpperCase() + spells[i].spellName.slice(1),
            description: spells[i].spellDescription,
            value: spells[i].spellName + '_' + idChallenger + '_' + idOpponent
          }
        )
      }
      const row = new Discord.ActionRowBuilder().addComponents(list);

      if (duelStatus === "counter") {
        const messageDuel = message.reference ? await message.fetchReference() : message;
        await messageDuel.reply({ content: '<@' + idOpponent + '> choisis ton Sort !', components: [row], ephemeral: true });
      } else if (duelStatus === "attack") {
        await message.channel.send({ content: '<@' + idChallenger + '> choisis ton Sort !', components: [row], ephemeral: true });
      }
    }
    } else {
      const spellSelect = new SpellSelect(message, { duelStatus: duelStatus });
      return spellSelect.sendCounterSelect();
    }
}

export async function showDuel(interaction, dataSelectMenu, duelStatus) {
  const dataDuel = await createDataDuel(interaction, dataSelectMenu, duelStatus);

  if (!dataDuel) {
    return false;
  } else {
    const embedTitle = "Duel Lancé !";
    /*let houseDescription;
    if (cupActive == listCupActive[0]) {
      houseDescription = " de la maison ";
    } else if (cupActive == listCupActive[1]) {*/
    const houseDescription = " de la maison ";

    const duelMessage =
      dataDuel.challenger.toString() +
      houseDescription +
      dataDuel.houseChallenger +
      " tente d'utiliser " +
      dataDuel.spellChallenger.toLowerCase() +
      " sur " +
      dataDuel.opponent.toString() +
      houseDescription +
      dataDuel.houseOpponent +
      ".";
    const footerMessage =
      "Pour répondre à cette attaque, répondez à ce message avec \"!contre\".";

    //Créer le message et l'envoyer*
    const embedShowDuel = new Discord.EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle(embedTitle)
      .setDescription(duelMessage)
      .setFooter({ text: footerMessage });

    await interaction.message.channel.send({ embeds: [embedShowDuel], components :[new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId("contreDuel")
        .setLabel("Contre")
        .setStyle(ButtonStyle.Primary))] });
    await interaction.message.delete();
  }
}

export async function duelingPreparation(interaction, dataSelectMenu, duelStatus) {
  const messageDuel = await interaction.message.fetchReference();
  const dataDuel = await createDataDuel(messageDuel, dataSelectMenu, duelStatus);

  if (dataDuel) {
    duel(messageDuel, dataDuel, interaction);
  }
}

export async function duel(messageDuel, dataDuel, interaction) {
  const channel = messageDuel.channel;
  let rng_Challenger = getRandomInt(1, 10+Number(dataDuel.ratioChallenger));
  let rng_Opponent = getRandomInt(1, 10+Number(dataDuel.ratioOpponent));

  if (dataDuel.idChallenger == 'u' && rng_Challenger >= rng_Opponent) {
    rng_Opponent = rng_Challenger;
    rng_Challenger -= 1;
  }

  let dataWin = {
    nameWinner: "",
    houseWinner: "",
    spellWinner: "",
    nameLooser: "",
    houseLooser: "",
  };

  let duelNull = false;

  if (rng_Challenger == rng_Opponent) {
    duelNull = true;
  } else if (rng_Challenger > rng_Opponent) {
    dataWin.nameWinner = dataDuel.challenger;
    dataWin.nameLooser = dataDuel.opponent;
    dataWin.houseWinner = dataDuel.houseChallenger;
    dataWin.houseLooser = dataDuel.houseOpponent;
    dataWin.spellWinner = dataDuel.spellChallenger;
  } else {
    dataWin.nameWinner = dataDuel.opponent;
    dataWin.nameLooser = dataDuel.challenger;
    dataWin.houseWinner = dataDuel.houseOpponent;
    dataWin.houseLooser = dataDuel.houseChallenger;
    dataWin.spellWinner = dataDuel.spellOpponent;
  }

  // Création du message du combat
  const winMessage = await createWinMessage(dataWin, channel);
  let challengerResult = '';
  if (dataDuel.idChallenger == 'u') {
    challengerResult = "Attaque" + " (" + rng_Challenger + ")";
  } else {
    challengerResult = dataDuel.spellChallenger + " (" + rng_Challenger + ")";
  }
  const opponentResult = dataDuel.spellOpponent + " (" + rng_Opponent + ")";
  let challengerName = '';
  if (dataDuel.idChallenger == 'u') {
    challengerName = 'une créature';
  }
  else { challengerName = dataDuel.challenger.displayName; }

  const opponentName = dataDuel.opponent.displayName;

  const embed = new Discord.EmbedBuilder()
    .setColor(0x00ffff)
    .setTitle("Duel Terminé !")
    .setDescription(winMessage)
    .addFields(
      { name: challengerName, value: challengerResult, inline: true },
      { name: "Vs", value: "\u200B", inline: true },
      { name: opponentName, value: opponentResult, inline: true }
    );
  await channel.send({ embeds: [embed] });
  await interaction.message.delete();
  await messageDuel.delete();

  if (!duelNull) {
    const cptChannel = channel.messages.client.channels.cache.get(
      idRoom.hogwart
    );
    let indice = 0;
    if (dataDuel.opponent._roles.find((memberRole) => memberRole == '1073201979062497300')) {
      indice += 10;
    }
    cptChannel.send("!add " + (parseInt(bareme.duel) + parseInt(indice)).toString() + " to " + dataWin.houseWinner);
    if (dataDuel.idChallenger != 'u') {
      cptChannel.send("!remove " + bareme.duel + " to " + dataWin.houseLooser);
    }
  }
}

async function createWinMessage(dataWin, channel) {
  let winMessage;
  const mySpellRepository = new SpellRepository();
  const spells = await mySpellRepository.getSpells(channel);
  if (spells) {
    winMessage = await spells.find(
      (spell) => spell.spellName.toLowerCase() == dataWin.spellWinner.toLowerCase()
    );

    if (!winMessage) {
      winMessage =
        "Oh ! Leurs attaques s'entre-choc et s'annulent toutes les deux. c'est une égalité !";
    } else {
      if (dataWin.nameLooser == '') {
        dataWin.nameLooser = 'une créature';
      }

      //on construit le winMessage
      winMessage = winMessage.spellMessage;
      winMessage = await winMessage
        .replace("@nameWinner", dataWin.nameWinner)
        .replace("@nameLooser", dataWin.nameLooser)
        .replace("@points", bareme.duel)
        .replace("@houseLooser", dataWin.houseLooser ? "aux " + dataWin.houseLooser : '');

    }
  }
  /*switch (dataWin.spellWinner) {
    // Coupe des 4 maisons
    case "avada_kedavra":
      winMessage =
        dataWin.nameWinner +
        "à tuer " +
        dataWin.nameLooser +
        " avec le sort interdit, Avada Kedavra. La maison " +
        dataWin.houseWinner +
        " récupère " +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
    case "impédimenta":
      winMessage =
        dataWin.nameWinner +
        " à fait tomber " +
        dataWin.nameLooser +
        ", il remporte le combat. La maison " +
        dataWin.houseWinner +
        " récupère " +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
    case "imobilis":
      winMessage =
        dataWin.nameLooser +
        " a été immobilisé par " +
        dataWin.nameWinner +
        " et perd le combat. La maison " +
        dataWin.houseWinner +
        " récupère" +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
    case "stupéfix":
      winMessage =
        dataWin.nameWinner +
        " utilise " +
        dataWin.spellWinner +
        " sur " +
        dataWin.nameLooser +
        " est réussi. La maison " +
        dataWin.houseWinner +
        " récupère " +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
  }*/

  return winMessage;
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

      if (idOpponent === idOpponentDuel || duelDescription == 'une créature attaque, défendez Poudlard') {
        if (duelDescription == 'une créature attaque, défendez Poudlard') {
          //recherche de Mangemort         
          if (message.member._roles.find((memberRole) => memberRole == '1073201979062497300')) {
            message.author.send("Vous souhaitez vraiment défendre Poudlard ? ce n'est pas digne d'un mangemort")
            return false;
          } else {
            return true;
          }
          
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
      "une créature attaque, défendez Poudlard";
    const footerMessage =
      "Pour répondre à cette attaque, répondez à ce message avec \"!contre\".";

    //Créer le message et l'envoyer*
    const embedShowDuel = new Discord.EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle(embedTitle)
      .setDescription(duelMessage)
      .setFooter({ text: footerMessage })
      .setThumbnail('https://bookstr.com/wp-content/uploads/2019/07/Scroutt_2.png');

  message.channel.messages.client.channels.cache.get('1064843417663844363').send({ embeds: [embedShowDuel] });
}