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
