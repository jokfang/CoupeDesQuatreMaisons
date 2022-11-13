import { Repository } from "../repository/repository.js";
import { channelBox } from "../index.js";
import { bareme } from "../librairy/cupInfo.js";

export async function addMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();
  const myRepository = new Repository();
  //const channelCup = channelBox[cupActive];
  const channelCup = channelBox.ohana;
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
  //const channelCup = channelBox[cupActive];
  const channelCup = channelBox.ohana;
  member.roles.remove(role);
  myRepository.deleteMember(channelCup, member.id, role.id);
}

export async function houseMembre(member, message, attaquantHouse) {
  const myRepository = new Repository();
  //const channelCup = channelBox[cupActive];
  const channelCup = channelBox.ohana;
  const maisons = await myRepository.getMaisons(channelCup);
  let houseMember;
  let houseChallenger;

  for (let maison of maisons) {
    if (member._roles.find((memberRole) => memberRole == maison.roleId)) {
      houseMember = await maison.nom;
    }
    if (attaquantHouse) {
      if (
        attaquantHouse._roles.find((memberRole) => memberRole == maison.roleId)
      ) {
        houseChallenger = await maison.nom;
      }
    }
  }
  if (member.id == "934876238089162872" && houseChallenger) {
    message.channel.send(
      "Tu oses attaquer Blue ! Tu n'as aucun pouvoir ici ! Tu perds 10 points !"
    );
    const cptChannel = message.channel.messages.client.channels.cache.get(
      "1021509224343281764"
    );
    cptChannel.send("!remove " + bareme.duel + " to " + houseChallenger);
    for (let maison of maisons) {
      if (maison.nom != houseChallenger) {
        cptChannel.send("!add " + bareme.duel + " to " + maison.nom);
      }
    }
  } else if (!houseMember) {
    const duelMessage = member.displayName + " n'a pas de maison.";
    await message.author.send(duelMessage);
  } else {
    return houseMember;
  }
}
