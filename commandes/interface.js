import { Repository } from "../repository/repository.js";
import * as Discord from "discord.js";
import { bareme, bareme_multiple, currentCup } from "../librairy/cupInfo.js";
import { ButtonStyle } from "discord.js";

// Obtient un menu de bouton.
export function getButtonInterface(message) {
  const rowButton = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("interfacePointByHouse")
        .setLabel("Ajoute de points par famille")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("interfacePointByMember")
        .setLabel("[Construction]Ajoute de points par membre")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("interfaceExit")
        .setLabel("Fermer")
        .setStyle(ButtonStyle.Secondary)
    );

  message.channel.send({
    content: "***Menu des Interfaces***",
    components: [rowButton],
  });
}

//Création d'un interface de bouton d'ajoute de point

export async function getButtonInterface_PointByHouse(interaction) {
  const myRepository = new Repository();
  const channelCup = currentCup;
  const maisons = await myRepository.getMaisons(channelCup);

  // Création des boutons pour les quatre premières maisons

  const rowHouse0 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("interfacePoint_" + maisons[0].nom)
      .setLabel(maisons[0].nom)
      .setStyle(ButtonStyle.Secondary)
  );
  const rowHouse1 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("interfacePoint_" + maisons[1].nom)
      .setLabel(maisons[1].nom)
      .setStyle(ButtonStyle.Secondary)
  );
  const rowHouse2 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("interfacePoint_" + maisons[2].nom)
      .setLabel(maisons[2].nom)
      .setStyle(ButtonStyle.Secondary)
  );
  const rowHouse3 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("interfacePoint_" + maisons[3].nom)
      .setLabel(maisons[3].nom)
      .setStyle(ButtonStyle.Secondary)
  );

  getButtonHouse(maisons, 0, rowHouse0);
  getButtonHouse(maisons, 1, rowHouse1);
  getButtonHouse(maisons, 2, rowHouse2);
  getButtonHouse(maisons, 3, rowHouse3);

  interaction.reply({
    content: "***Menu: Ajoute de point par maison***",
    components: [rowHouse0, rowHouse1, rowHouse2, rowHouse3],
    ephemeral: true,
  });
}

export async function getButtonInterface_house(interaction, house) {
  const myRepository = new Repository();
  const channelCup = currentCup;
  const maisons = await myRepository.getMaisons(channelCup);

  let rowBits = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("add_" + house + "_bits")
      .setLabel("100 Bits")
      .setStyle(ButtonStyle.Secondary)
  );
  let rowSubT1 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("add_" + house + "_subT1")
      .setLabel("SubT1")
      .setStyle(ButtonStyle.Secondary)
  );
  let rowSubT2 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("add_" + house + "_subT2")
      .setLabel("SubT2")
      .setStyle(ButtonStyle.Secondary)
  );
  let rowSubT3 = new Discord.ActionRowBuilder().addComponents(
    new Discord.ButtonBuilder()
      .setCustomId("add_" + house + "_subT3")
      .setLabel("SubT3")
      .setStyle(ButtonStyle.Secondary)
  );

  for (let propriety in bareme_multiple) {
    const type = propriety.split("_")[0];
    const multipleType = propriety.split("_")[1];

    switch (type) {
      case "bits":
        rowBits.addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("addMultiple_" + house + "_" + propriety)
            .setLabel(multipleType + " " + type)
            .setStyle(ButtonStyle.Primary)
        );
        break;
      case "subT1":
        rowSubT1.addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("addMultiple_" + house + "_" + propriety)
            .setLabel(multipleType + " " + type)
            .setStyle(ButtonStyle.Primary)
        );
        break;
      case "subT2":
        rowSubT2.addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("addMultiple_" + house + "_" + propriety)
            .setLabel(multipleType + " " + type)
            .setStyle(ButtonStyle.Primary)
        );
        break;
      case "subT3":
        rowSubT3.addComponents(
          new Discord.ButtonBuilder()
            .setCustomId("addMultiple_" + house + "_" + propriety)
            .setLabel(multipleType + " " + type)
            .setStyle(ButtonStyle.Primary)
        );
        break;
      default:
    }
  }
  interaction.reply({
    content: "***" + house + "***",
    components: [rowBits, rowSubT1, rowSubT2, rowSubT3],
    ephemeral: true,
  });
}

export async function getButtonInterface_PointByMember(interaction) {
  const myRepository = new Repository();
  const channelCup = currentCup;
  const maisons = await myRepository.getMaisons(channelCup);

  const rowMember = new Discord.ActionRowBuilder();
}

function getButtonHouse(maisons, i, rowHouse) {
  for (let type in bareme) {
    if (["bits", "subT1", "subT2", "subT3"].includes(type)) {
      let messageLabel = type;
      if (type == "bits") {
        messageLabel = messageLabel.replace(type, "100 " + type);
      }

      rowHouse.addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("add_" + maisons[i].nom + "_" + type)
          .setLabel(messageLabel)
          .setStyle(ButtonStyle.Primary)
      );
    }
  }
}
