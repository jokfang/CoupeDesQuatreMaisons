import { EmbedBuilder } from "discord.js";

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
export function help(channel) {
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
        "Si il n'y en avait pas eu avant elle créé 4 maisons avec des valeurs par défaut, sinon elle recréé les maisons qui avait été créé sur ce channel",
    },
    {
      name: "!addHouse",
      value:
        "Ajoute une nouvelle maison avec des valeurs par défaut. \n" +
        "!addHouse Nom Couleur URL (attributs optionnels, on peut faire un !addHouse Nom ou un !addHouse Nom Couleur) ajoute une maison avec un Nom, une Couleur(voir !setCouleur pour le fonctionnement) et un blason correspondant à URL\n" +
        "il est conseillé de modifier le nom de celle ci tout de suite après, cela créé également un role avec le même nom qu'il faudra personnaliser via la modération du discord",
    },
    {
      name: "!removeHouse",
      value:
        "Supprime une maison, son role et son message. \n" +
        "!removeHouse Maison supprime la maison Maison",
    },
    {
      name: "!houseCupHelp",
      value: "Affiche ce message d'aide, mais ça tu le sais déjà ;)",
    }
  );
  channel.send({ embeds: [embed] });
}
