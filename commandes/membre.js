import { Repository } from "../repository/repository.js";
import { channelBox } from "../index.js";
import { bareme, idRoom } from "../librairy/cupInfo.js";

export async function addMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();
  const myRepository = new Repository();

  const channelCup = channelBox.hogwart;
  const maisons = await myRepository.getMaisons(channelCup);
  if (
    !maisons.find((maison) =>
      member._roles.find((memberRole) => memberRole == maison.roleId)
    )
  ) {
    member.roles.add(role);
    myRepository.addMember(channelCup, member.id, role.id);
  }
}

export async function removeMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();
  const myRepository = new Repository();

  const channelCup = channelBox.hogwart;
  member.roles.remove(role);
  myRepository.deleteMember(channelCup, member.id, role.id);
}

export async function houseMembre(member) {
  const myRepository = new Repository();

  const channelCup = channelBox.hogwart;
  const maisons = await myRepository.getMaisons(channelCup);
  let houseMember = {
    name: '',
    id: ''
  };

  for (let maison of maisons) {
    if (member._roles.find((memberRole) => memberRole == maison.roleId)) {
      houseMember.name = await maison.nom;
      houseMember.id = await maison.roleId;
    }
  }
  return houseMember;
}

export async function houseMembreDuel(dataDuel) {
  const myRepository = new Repository();

  const channelCup = channelBox.hogwart;
  const maisons = await myRepository.getMaisons(channelCup);

  for (let maison of maisons) {
    // check house Challenger
    if (dataDuel.idChallenger != 'u') {
      if (await dataDuel.challenger._roles.find((memberRole) => memberRole == maison.roleId)) {
        dataDuel.houseChallenger = await maison.nom;
        dataDuel.idHouseChallenger = await maison.roleId;
      }
    }
    // check house Opponnent
    if (await dataDuel.opponent._roles.find((memberRole) => memberRole == maison.roleId)) {
      dataDuel.houseOpponent = await maison.nom;
      dataDuel.idHouseOpponent = await maison.roleId;
    }
  }

  if (dataDuel.idOpponent == "934876238089162872" && dataDuel.houseChallenger.length > 0) {
    message.channel.send(
      "Tu oses attaquer Blue ! Tu n'as aucun pouvoir ici ! Tu perds 10 points !"
    );
    const cptChannel = message.channel.messages.client.channels.cache.get(
      idRoom.hogwart
    );
    cptChannel.send("!remove " + bareme.duel + " to " + dataDuel.houseChallenger);
    for (let maison of maisons) {
      if (maison.nom != dataDuel.houseChallenger) {
        cptChannel.send("!add " + bareme.duel + " to " + maison.nom);
      }
    }
  } else if ((dataDuel.houseChallenger.length === 0 || dataDuel.houseOpponent.length === 0) && dataDuel.idChallenger != 'u') {
    error_noHouse(dataDuel);
  } else {
    return dataDuel;
  }
}

// Message d'erreur

function error_noHouse(dataDuel) {
  let messageError = "@player pas de maison."

  if (dataDuel.houseChallenger.length === 0) {
    messageError.replace('@player', 'Vous n\'avez ');
  } else if (dataDuel.houseOpponent.length === 0) {
    messageError.replace('@player', dataDuel.opponent + ' n\'a ');
  } else if (dataDuel.houseChallenger.length === 0 && dataDuel.houseOpponent.length === 0) {
    messageError.replace('@player', 'Vous et ' + dataDuel.opponent + 'n\'avaient ');
  }
  dataDuel.message.author.send(messageError);
}