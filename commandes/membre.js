import { Repository } from "../repository/repository.js";

export async function addMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();
  const myRepository = new Repository();
  const maisons = await myRepository.getMaisons(message.channel);
  if (
    !maisons.find((maison) =>
      member._roles.find((memberRole) => memberRole == maison.roleId)
    )
  ) {
    member.roles.add(role);
    myRepository.addMember(message.channel, member.id, role.id);
  }
}

export async function removeMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();
  const myRepository = new Repository();

  member.roles.remove(role);
  myRepository.deleteMember(message.channel, member.id, role.id);
}

export async function houseMembre(member, message) {
  const myRepository = new Repository();
  const maisons = await myRepository.getMaisons(message.channel);
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
