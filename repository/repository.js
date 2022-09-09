import mysql from 'mysql2';
import * as houses from '../data/info.cjs';

export class Repository{
    constructor() {
       
    }
    //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
    async getMaison(channel, maison){
        //const con = mysql.createConnection({host: "bdd.adkynet.com", user: "u11534_VHEi919q3T", password: "q3hY5r^1^c8ZXsUl43kS3CaD", port: "3306", database: "s11534_HouseCup"});
        const con = mysql.createConnection({
            host: houses.default.host, 
            user: houses.default.user, 
            password: houses.default.password, 
            port: houses.default.port, 
            database: houses.default.database});
        con.connect(function (err) {
            if (err){
                if(err.message.code === 'ETIMEDOUT'){
                    console.log('TimeOut de la BDD');
                }
            }
            //console.log("Connected to MySQLDB");
        });
        const query = 'select * from Coupe where channel = ? and nom = ?';
      	const retour = await con.promise().query(query, [channel.id, maison]);
        con.end();

        return retour[0][0];
    }
}