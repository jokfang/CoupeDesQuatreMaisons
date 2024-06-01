export async function getMemberById(channel, id) {
    return await channel.guild.members.fetch(id)
}