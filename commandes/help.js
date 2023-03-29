import { EmbedBuilder } from "discord.js";

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
export function help(message) {
  const embed = new EmbedBuilder().addFields(
    {
      name: "!add",
      value:
        "Permet d'ajouter des points ou une personne à une maison.\n" +
        "!add X to Maison ajoute X points à la maison Maison (possible de remplacer Maison par @machin qui ajoutera des points à la maison de @machin). \n" +
        "!add @machin to Maison ajoute @machin à la maison Maison",
    },
    {
      name: "!remove",
      value:
        "Permet de retirer des points ou une personne à une maison à une maison. \n" +
        "!remove X to Maison retire X points à une maison (cette commande à les mêmes possibilité que !add)",
    },
    {
      name: "!setBlason",
      value:
        "Permet de changer le blason d'une maison. \n" +
        "!setBlason URL to Maison applique le blason correspondant à l'URL indiqué à la maison Maison",
    },
    {
      name: "!setNom",
      value:
        "Permet de changer le nom d'une maison. \n" +
        "!setNom Nom to Maison applique un nouveau nom Nom indiqué à la maison Maison",
    },
    {
      name: "!setPoint",
      value:
        "Permet de changer les points d'une maison. \n" +
        "!setPoint X to Maison change les points de la maison Maison afin qu'ils soient égaux à X",
    },
    {
      name: "!setCouleur",
      value:
        "Permet de changer la couleur d'une maison. \n" +
        "!setCouleur Couleur to Maison applique la couleur correspondante à la maison Maison, la couleur peut être indiqué en anglais ou en hexadécimal (0xffff00 par exemple)",
    },
    {
      name: "!newHouseCup",
      value:
        "Lance une nouvelle coupe des quatres maisons. \n" +
        "cette commande créé/recréé les maisons qui avait été initié sur ce channel",
    },
    {
      name: "!removeHouse",
      value:
        "Supprime une maison, son role et son message. \n" +
        "!removeHouse Maison supprime la maison Maison",
    },
    {
      name: "!helpHouseCup",
      value: "Affiche ce message d'aide, mais ça tu le sais déjà ;)",
    }
  );
  message.author.send({ embeds: [embed] });
}
