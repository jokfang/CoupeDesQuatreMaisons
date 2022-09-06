import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import {Point} from './commandes/point.js'
import {newHouseCup} from './commandes/maison.js'
import * as houses from './data/info.cjs';

//Droit attribué au bot
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages]});
//Token à masquer par la suite
const token= 'MTAxNTkzMTYwODc3MzE2OTE5Mw.GPpV-Y.MsmpOQN8XLtXBBpVcI7IzPv-3k6vRMF91FKZik';

//Connexion du bot
client.once('ready',()=> {console.log('Félicitations, votre bot est ok !');});
client.login(token);

//Lorsqu'on reçoit un message:
client.on("messageCreate", async function(message){
    try{
        console.log(message.content);
        let isOK = true;
        isOK = checkMessage(message.content);
        if (message.content.split(' ')[0] === "!add" && isOK){
            //On récupère la maison     
            let maison = houses.default.maisons.find(element => element.nom == message.content.split(' ')[3]);

            //On ajoute les points en modifiant le message, puis on supprime la commande
            addPoints(maison, parseInt(message.content.split(' ')[1]), message.channel);
            message.delete();
        }
        else if(message.content.split(' ')[0] === "!remove" && isOK){
            //On récupère la maison      
            let maison = houses.default.maisons.find(element => element.nom == message.content.split(' ')[3]).number;

            //On retire les points en modifiant le message, puis on supprime la commande
            removePoint(maison, parseInt(message.content.split(' ')[1]), message.channel);
            message.delete();
        }
        else if(message.content.split(' ')[0] === "!setBlason" && isOK){
            //On récupère la maison      
            let maison = houses.default.maisons.find(element => element.nom == message.content.split(' ')[3]).number;

            //On modifie le blason, puis on supprime la commande
            setBlason(maison, message.content.split(' ')[1], message.channel);
            message.delete();
        }
        else if(message.content.split(' ')[0] === "!setNom" && isOK){
            //On récupère la maison      
            let maison = houses.default.maisons.find(element => element.nom == message.content.split(' ')[3]).number;

            //On modifie le nom, puis on supprime la commande
            setNom(maison, message.content.split(' ')[1], message.channel);
            message.delete();
        }
        else if(message.content.split(' ')[0] === "!setPoint" && isOK){
            //On récupère la maison      
            let maison = houses.default.maisons.find(element => element.nom == message.content.split(' ')[3]).number;

            //On attribue les points en modifiant le message, puis on supprime la commande
            setPoint(maison, parseInt(message.content.split(' ')[1]), message.channel);
            message.delete();
        }
        else if(message.content.split(' ')[0] === "!setCouleur" && isOK){
            //On récupère la maison      
            let maison = houses.default.maisons.find(element => element.nom == message.content.split(' ')[3]).number;

            //On attribue la couleur en modifiant le message, puis on supprime la commande
            setColor(maison, message.content.split(' ')[1], message.channel);
            message.delete();
        }
        else if(message.content.split(' ')[0] === "!newHouseCup" && isOK){
            //Si les points sont renseigné on envois les points, sinon on créé les messages avec 0 points
            if(message.content.split(' ').length > 1){
                newHouseCups(message.channel, (message.content.split(' ')[1]).split('.'));
            }
            else{
                
                newHouseCups(message.channel); 
            }
            message.delete();
        }
    }
    catch(error){
        await message.channel.send("Une erreur a été rencontré, tu peux supprimer ce message et ton appel (ou le montrer à un dév) et retenter");
        console.log(error.message);
    }
});

//Ajoute des points à une maison en prenant son id et le montant de point à ajouter
async function addPoints(maison, montant, channel){
    const messageId = houses.default.maisons[maison].messageId;
    const msg = await channel.messages.fetch(messageId);

    //On incrémente le compteur
    let cpt = parseInt(msg.embeds[0].data.description);
    cpt += montant;

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder().setColor(houses.default.maisons[maison].couleur)
        .setTitle(houses.default.maisons[maison].nom)
        .setThumbnail(houses.default.maisons[maison].blason)
        .setDescription(cpt.toString());
    //On édit le message
    msg.edit({embeds: [embed]});
}

//Retire des points à une maison en prenant son id et le montant de point à retirer
async function removePoint(maison, montant, channel){
    const messageId = houses.default.maisons[maison].messageId;
    const msg = await channel.messages.fetch(messageId);

    //On décrémente le compteur
    let cpt = parseInt(msg.embeds[0].data.description);
    cpt -= parseInt(montant);

    if(cpt<0){cpt = 0;}

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder().setColor(houses.default.maisons[maison].couleur)
        .setTitle(houses.default.maisons[maison].nom)
        .setThumbnail(houses.default.maisons[maison].blason)
        .setDescription(cpt.toString());
    //On édit le message
    msg.edit({embeds: [embed]});
}

async function setBlason(maison, image, channel){
    const messageId = houses.default.maisons[maison].messageId;
    const msg = await channel.messages.fetch(messageId);

    let cpt = parseInt(msg.embeds[0].data.description);
    houses.default.maisons[maison].blason = image
    if(cpt<0){cpt = 0;}

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder().setColor(houses.default.maisons[maison].couleur)
        .setTitle(houses.default.maisons[maison].nom)
        .setThumbnail(houses.default.maisons[maison].blason)
        .setDescription(cpt.toString());
    //On édit le message
    msg.edit({embeds: [embed]});
}

async function setNom(maison, nom, channel){
    const messageId = houses.default.maisons[maison].messageId;
    const msg = await channel.messages.fetch(messageId);

    let cpt = parseInt(msg.embeds[0].data.description);
    houses.default.maisons[maison].nom = nom
    if(cpt<0){cpt = 0;}

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder().setColor(houses.default.maisons[maison].couleur)
        .setTitle(houses.default.maisons[maison].nom)
        .setThumbnail(houses.default.maisons[maison].blason)
        .setDescription(cpt.toString());
    //On édit le message
    msg.edit({embeds: [embed]});
}

async function setColor(maison, couleur, channel){
    const messageId = houses.default.maisons[maison].messageId;
    const msg = await channel.messages.fetch(messageId);

    let cpt = parseInt(msg.embeds[0].data.description);
    houses.default.maisons[maison].couleur = couleur

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder().setColor(houses.default.maisons[maison].couleur)
        .setTitle(houses.default.maisons[maison].nom)
        .setThumbnail(houses.default.maisons[maison].blason)
        .setDescription(cpt.toString());
    //On édit le message
    msg.edit({embeds: [embed]});
}

async function setPoint(maison, montant, channel){
    const messageId = houses.default.maisons[maison].messageId;
    const msg = await channel.messages.fetch(messageId);

    let cpt = parseInt(montant);

    if(cpt<0){cpt = 0;}

    //On construit le message qui sera appliqué en annule et remplace du précédent
    const embed = new EmbedBuilder().setColor(houses.default.maisons[maison].couleur)
        .setTitle(houses.default.maisons[maison].nom)
        .setThumbnail(houses.default.maisons[maison].blason)
        .setDescription(cpt.toString());
    //On édit le message
    msg.edit({embeds: [embed]});
}

async function newHouseCups(channel, points){
    //Pour chaque maisons on créé un message
    //Un passage en base de données pourrait être intéressant pour stabiliser le bot
    for (let i = 0; i < houses.default.maisons.length; i++){
        let point = 0;

        //Si les points sont bien renseigné
        if (points && points.length == houses.default.maisons.length) {
            point = parseInt(points[i]);
        }
        //On constuit le nouveau message
        const embed = new EmbedBuilder().setColor(houses.default.maisons[i].couleur)
        .setTitle(houses.default.maisons[i].nom)
        .setThumbnail(houses.default.maisons[i].blason)
        .setDescription(point.toString());

        //On envois le message
        let message = await channel.send({embeds: [embed]});

        //On met à jour les données du bot
        houses.default.maisons[i].messageId = message.id;
        houses.default.maisons[i].number = i;
    }
}

function checkMessage(message){
    message = message + ""
    if(message.substring(0,1) != '!'){
        return false;
    }
    if(message.split(' ')[0] == '!newHouseCup'){
        return true
    }else if(message.split(' ').length == 4){
        if(!houses.default.maisons.find(element => element.nom == message.split(' ')[3])){
            return false;
        }
    }
    return true;
}