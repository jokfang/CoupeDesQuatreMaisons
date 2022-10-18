import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { attackLinkHouse } from "../index.js";
import { getRandomInt } from "../commandes/items.js";
import { addPoint, removePoint } from "../commandes/point.js";
import { houseMembre } from "../commandes/membre.js";
import * as dataGames from "../librairy/game.cjs";

export async function createDataDuel(message) {
  let dataDuelInit = {
    message: message,
    idGuild: message.guildId,
    idChannel: message.channelId,
    channel: message.channel,
    idChallenger: "",
    challenger: "",
    houseChallenger: "",
    spellChallenger: "",
    idOpponent: "",
    opponent: "",
    houseOpponent: "",
    spellOpponent: "",
  };
  let spell = message.content.split(" ")[1];
  let opponent = message.mentions.members.first();
  let challenger = message.member;

  if (!opponent) {
    let idOpponent = message.content.split(" ")[2].substring(2);
    idOpponent = idOpponent.replace(/>/, "");
    opponent = await message.guild.members.fetch(idOpponent);
  }
  if (!challenger) {
    let idChallenger = message.author.id;
    challenger = await message.guild.members.fetch(idChallenger);
  }

  dataDuelInit.idChallenger = challenger.id;
  dataDuelInit.challenger = challenger.displayName;
  dataDuelInit.houseChallenger = await houseMembre(challenger, message);
  dataDuelInit.spellChallenger = spell.toLowerCase();
  dataDuelInit.idOpponent = opponent.id;
  dataDuelInit.opponent = opponent.displayName;
  dataDuelInit.houseOpponent = await houseMembre(opponent, message);
  const spellOk = checkSpell(
    spell.toLowerCase(),
    dataDuelInit.houseChallenger,
    message
  );

  if (spellOk) {
    return dataDuelInit;
  }
}

export async function showDuel(dataDuel, message) {
  let duelMessage;
  if (!dataDuel) {
    return false;
  } else if (dataDuel.houseChallenger === dataDuel.houseOpponent) {
    message.author.send(
      "Vous ne pouvez pas attaquer quelqu'un de votre propre maison."
    );
  } else {
    const embedTitle = "Duel Lancé !";

    let houseDescription;
    if (attackLinkHouse == "Potter") {
      houseDescription = " de la maison ";
    } else if (attackLinkHouse == "Disney") {
      houseDescription = " de la Ohana des ";
    }

    const duelMessage =
      "@" +
      dataDuel.challenger.toString() +
      houseDescription +
      dataDuel.houseChallenger +
      " tente d'utiliser " +
      dataDuel.spellChallenger +
      " sur @" +
      dataDuel.opponent.toString() +
      houseDescription +
      dataDuel.houseOpponent +
      ".";
    const footerMessage =
      "Pour lancer le combat, réponder à se message avec !contre [Sort].";

    //Créer le message et l'envoyer*
    const embedShowDuel = new EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle(embedTitle)
      .setDescription(duelMessage)
      .setFooter({ text: footerMessage });
    await message.reply({ embeds: [embedShowDuel] });
  }
}

export async function counter(message, opponent, spell) {
  const messageBox = await checkReference(message);
  if (messageBox.messageAttack) {
    let dataDuel = await createDataDuel(messageBox.messageAttack);

    if (opponent === dataDuel.opponent || 1 == 1) {
      const spellOk = checkSpell(
        spell.toLowerCase(),
        dataDuel.houseOpponent,
        message
      );

      if (spellOk) {
        dataDuel.spellOpponent = spell.toLowerCase();
        duel(messageBox, dataDuel);
      }
    } else {
      message.author.send("Erreur, vous n'êtes pas la cible du duel.");
    }
  } else {
    message.author.send(
      "Erreur, vous n'avais probablement pas répondu au mesage du Bot."
    );
  }
}

export async function duel(messageBox, dataDuel) {
  const rng_Challenger = getRandomInt(1, 11);
  const rng_Opponent = getRandomInt(1, 11);

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
  const winMessage = await findWinMessage(dataWin);
  const challengerResult =
    dataDuel.spellChallenger + " (" + rng_Challenger + ")";
  const opponentResult = dataDuel.spellOpponent + " (" + rng_Opponent + ")";

  const embed = new EmbedBuilder()
    .setColor(0x00ffff)
    .setTitle("Duel Terminé !")
    .setDescription(winMessage)
    .addFields(
      { name: dataDuel.challenger, value: challengerResult, inline: true },
      { name: "Vs", value: "\u200B", inline: true },
      { name: dataDuel.opponent, value: opponentResult, inline: true }
    );
  await dataDuel.channel.send({ embeds: [embed] });

  //Ajout de point automatique à solutionner
  /*if (!duelNull) {
    await addPoint(dataWin.houseWinner, 10, messageBox.messageBot);
    await removePoint(dataWin.houseLooser, 10, messageBox.messageBot);
  }*/
  await messageBox.messageAttack.delete();
  await messageBox.messageBot.delete();
  await messageBox.messageCounter.delete();
}

async function findWinMessage(dataWin) {
  let winMessage;
  const points = 10;

  switch (dataWin.spellWinner) {
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
    case "crache_limace":
      winMessage =
        "Aie ! " +
        dataWin.nameLooser +
        " se met à cracher des limaces à cause du sort de " +
        dataWin.nameWinner +
        ". La maison " +
        dataWin.houseWinner +
        " récupère " +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
    case "expelliarmus":
      winMessage =
        dataWin.nameWinner +
        " réussi à désarmer " +
        dataWin.nameLooser +
        " de sa baguette magique. La maison " +
        dataWin.houseWinner +
        " récupère " +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
    case "petrificus_totalus":
      winMessage =
        dataWin.nameLooser +
        " a été pétrifié par " +
        dataWin.nameWinner +
        " et perd le combat. La maison " +
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
    case "expelliarmus":
      winMessage =
        dataWin.nameWinner +
        " utilise Expelliarmus et le force " +
        dataWin.nameLooser +
        " à annoncer sa défaite. La maison " +
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
    case "silencio":
      winMessage =
        dataWin.nameLooser +
        " a perdu le droit de parler par " +
        dataWin.nameWinner +
        " et perd le combat. La maison " +
        dataWin.houseWinner +
        " récupère " +
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
    case "serpentasortia":
      winMessage =
        dataWin.nameWinner +
        " utilise " +
        dataWin.spellWinner +
        " créant un serpent au pied de" +
        dataWin.nameLooser +
        ", et fuit de peur. La maison " +
        dataWin.houseWinner +
        " récupère " +
        points +
        " points de la maison " +
        dataWin.houseLooser +
        ".";
      break;
    // Ohana Games
    case "Chant":
      winMessage =
        dataWin.nameWinner +
        " et les autres princesses chantent une berceuse endormant " +
        dataWin.nameLooser +
        ". L'équipe des Princesses rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "Coup_de_talon":
      winMessage =
        dataWin.nameWinner +
        " met un coup de talon sur " +
        dataWin.nameLooser +
        " le mettant hors de combat. L'équipe des Princesses rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "charme":
      winMessage =
        dataWin.nameWinner +
        " utilise ses charmes pour envouter " +
        dataWin.nameLooser +
        " le faisant admettre sa défaite. L'équipe des Princesses rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "rassemblement":
      winMessage =
        dataWin.nameWinner +
        " et les autres Super-Héros se rassemblent pour mettre un dérrouiller " +
        dataWin.nameLooser +
        ". L'équipe des Super-Héros rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "uppercut":
      winMessage =
        dataWin.nameWinner +
        " met un uppercant fracassant sur " +
        dataWin.nameLooser +
        " envoyant vers d'autres cieux. L'équipe des Super-Héros rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "laser":
      winMessage =
        dataWin.nameWinner +
        " fait sortir un laser de ses yeux pour blesser " +
        dataWin.nameLooser +
        " et remporter la victoire. L'équipe des Super-Héros rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "sbire":
      winMessage =
        dataWin.nameWinner +
        " envoie ses sbires pour maltraiter " +
        dataWin.nameLooser +
        ". L'équipe des Vilains rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "pomme_empoisonnée":
      winMessage =
        dataWin.nameWinner +
        " force " +
        dataWin.nameLooser +
        " a manger une pomme qui lui donne une envie d'aller au toilette. L'équipe des Vilains rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "transformation":
      winMessage =
        dataWin.nameWinner +
        " transforme " +
        dataWin.nameLooser +
        " en crapaud. L'équipe des Vilains rècupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser;
      break;
    case "abordage":
      winMessage =
        dataWin.nameWinner +
        " lance un abordage et met fin au combat après que " +
        dataWin.nameLooser +
        " soit entourée par les Pirates. L'équipe des Pirates rècpère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "coup_de_crochet":
      winMessage =
        dataWin.nameWinner +
        " esquive l'attaque de " +
        dataWin.nameLooser +
        " et contre avec un coup de crochet. L'équipe des Pirates rècpère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    case "lancer_de_baril":
      winMessage =
        dataWin.nameWinner +
        " lance un baril de poudre sur " +
        dataWin.nameLooser +
        " qui se retrouve blessé après l'explosion. L'équipe des Pirates récupère " +
        points +
        " points de l'équipe des " +
        dataWin.houseLooser +
        ".";
      break;
    default:
      winMessage =
        "Oh ! Leurs attaques s'entre-choc et s'annulent toutes les deux. c'est une égalité !";
  }

  return winMessage;
}

function checkSpell(spell, house, message) {
  let spellOk = false;

  //Coupe des 4 Maisons
  if (attackLinkHouse === "Potter") {
    const listSpell = dataGames.default.listSpellPotter;
    if (listSpell.find((spells) => spells == spell)) {
      spellOk = true;
    } else {
      message.author.send("Erreur lors du choix du sort.");
    }
  }

  // Ohana Games
  else if (attackLinkHouse === "Disney") {
    const listHouse = dataGames.default.listAttackDisney;

    if (
      (house === "Princesses" && listHouse[0].indexOf(spell) != -1) ||
      (house === "Super-Héros" && listHouse[1].indexOf(spell) != -1) ||
      (house === "Vilains" && listHouse[2].indexOf(spell) != -1) ||
      (house === "Pirates" && listHouse[3].indexOf(spell) != -1)
    ) {
      spellOk = true;
    } else {
      message.author.send(
        "Vous ne pouvez pas utliser l'attaque d'une autre équipe."
      );
    }
  }
  return spellOk;
}

async function checkReference(message) {
  let messageBox = {
    messageCounter: message,
    messageBot: "",
    messageAttack: "",
  };

  if (!message.reference) {
    messageBox.messageBot = false;
    messageBox.messageAttack = false;
    return messageBox;
  } else {
    const messageBot = await message.fetchReference();
    messageBox.messageBot = await messageBot;

    if (messageBot.member.roles.botRole) {
      const messageAttack = await messageBot.fetchReference();
      messageBox.messageAttack = await messageAttack;

      return messageBox;
    } else {
      await message.author.send(
        "Erreur, vous n'avez pas répondu au message du bot."
      );
    }
  }
}