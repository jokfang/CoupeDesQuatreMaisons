import mysql from 'mysql2';

export class Repository{
    constructor() {
        this.con = mysql.createConnection({host: "bdd.adkynet.com", user: "u11534_VHEi919q3T", password: "q3hY5r^1^c8ZXsUl43kS3CaD", port: "3306", database: "s11534_HouseCup"});
        this.con.connect(function (err) {
            if (err){
                if(err.message.code === 'ETIMEDOUT'){
                    console.log('TimeOut de la BDD');
                }
            }
            console.log("Connected to MySQLDB");
        });
    }
    //Ajoute des points à une maison en prenant son id et le montant de point à ajouter
    async getMaison(channel, maison){
        /*const con = mysql.createConnection({host: "bdd.adkynet.com", user: "u11534_VHEi919q3T", password: "q3hY5r^1^c8ZXsUl43kS3CaD", port: "3306"});
        con.connect(function(err){
                            if(err) throw err; 
                            console.log("Connected to MySQLDB")
                        });*/
        const query = 'select * from Coupe where channel = ? and nom = ?';
        const retour = await this.con.promise().query(query, [channel.id, maison]);

        return retour[0][0];
    }
}