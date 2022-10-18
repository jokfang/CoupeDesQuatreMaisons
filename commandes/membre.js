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
  }
}

export async function removeMembre(houseName, message) {
  let role = message.guild.roles.cache.find((role) => role.name == houseName);
  let member = message.mentions.members.first();

  member.roles.remove(role);
}

export async function houseMembre(member, message) {
  const myRepository = new Repository();
  const maisons = await myRepository.getMaisons(message.channel);
  let houseMember = false;

  for (let maison of maisons) {
    if ( 
      member._roles.find((memberRole) => memberRole == maison.roleId)
      ) {
      houseMember = await maison.nom;
    }
  } 
  
  if (houseMember == false) {
    const  duelMessage = member.displayName + " n'a pas de maison."
    await message.channel.send(duelMessage);
  } else {
    return houseMember;
  }
}