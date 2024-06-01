import { houseMembreDuel } from "../commandes/membre.js";
import { duelDescription } from "../type/duelParam.class.js";
import { SpellSelect } from "../class/spellSelect.js";
import { WaitingDuelMessage } from "../class/waitingDuelMessage.js";
import { Duel } from "../class/duel.js";
import { ErorrManager } from "../class/_errorManager.js";

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
  const errorManager = new ErorrManager();
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
        errorManager.sendAuthor(message, 'duel_notPlayer');
        return false;
      }
    }
    // Vérifie si l'Oppossant à une maison ou bien qu'il n'est pas dans celle du challenger.
    else {
      if (!houseOpponent.id) {
        errorManager.sendAuthor(message, 'notHouse_opponent');
      }
      else if (houseChallenger.id === houseOpponent.id) {
        errorManager.sendAuthor(message, 'duel_notRival');
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
        errorManager.sendAuthor(message, 'duel_notPlayer');
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
        errorManager.sendAuthor(message, 'duel_notOpponent')
        return false;
      }
    }
  }
}