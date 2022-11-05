import { Repository } from "../repository/repository.js";
import { channelBox } from "../index.js";

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

export async function houseMembre(member, message) {
  const myRepository = new Repository();
  //const channelCup = channelBox[cupActive];
  const channelCup = channelBox.ohana;
  const maisons = await myRepository.getMaisons(channelCup);
  let houseMember;

  for (let maison of maisons) {
    if (member._roles.find((memberRole) => memberRole == maison.roleId)) {
      houseMember = await maison.nom;
    }
  }

  if (!houseMember) {
    const duelMessage = member.displayName + " n'a pas de maison.";
    await message.author.send(duelMessage);
  } else {
    return houseMember;
  }
}
