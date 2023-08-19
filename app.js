const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");
const app = express();

app.use(express.json());

let database= null;

const initializeDbAndServer= async()=>{
    try {
        database= await({
        filename: databasePath,
        driver:sqlite3.Database,
    });
    app.listen(3000, () =>
    console.log("Server is running at http://localhost:3000/")

    );}
    catch(error) {
        console.log(`DB error: ${error.message}`)
        process.exit(1);
    }    

}
initializeDbAndServer();
const convertDbObjectToResponseObject= (dbObject) => {
    return{
        playerId:dbObject.player_Id,
        playerName: dbObject.player_Name,  
        jerseyNumber: dbObject.jersey_Number,
        role: dbObject.role,
    }
}

app.get('/players/', async (request, response) =>{
    const getPlayerQuery = `
    SELECT 
    * 
    FROM 
    cricket_team;`;
    const playersArray= await database.all(getPlayerQuery);
    response.send(
        playersArray.map((eachPlayer)=>{
            convertDbObjectToResponseObject(eachPlayer);
        })
    )
     
})

app.get('/players/:playerId', async (request, response) =>{
    
    const {playerId} = request.params;
    const getPlayerQuery = `
    SELECT 
    * 
    FROM 
    cricket_team
    WHERE 
    player_Id= ${playerId};`;
    const player= await database.all(getPlayerQuery);
    response.send(
        convertDbObjectToResponseObject(player);
        })
    )
     
})

app.post('/players/', async (request, response) =>{
    
    const {playerName, jerseyNumber, role} = request.body;
    const postPlayerQuery = `
    INSERT INTO 
        cricket_team (player_Name, jersey_Number, role)
    VALUES
        (${playerName}, ${jerseyNumber}, ${role});`;
    const player= await database.run(postPlayerQuery);
    response.send(
        "Player Added to Team"
        })
    )})

app.put('/players/:playerId', async (request, response) =>{
    
    const {playerName, jerseyNumber, role} = request.body;
    const {playerId}= request.params;
    const updatePlayerQuery = `
    UPDATE 
        cricket_team 
    SET 
        playerName= ${player_Name};   
        jerseyNumber= ${jersey_Number},
        role= ${role}; 
    }
    WHERE
        player_Id= ${playerId};`;
    await database.run(updatePlayerQuery);
    response.send(
        "Player Details Updated"})
    )
})

app.delete('/players/:playerId', async (request, response) =>{
    const {playerId}= request.params;
    const deletePlayerQuery = `
    DELETE FROM 
        cricket_team 
    WHERE 
        player_Id= ${playerId};`;
    await database.run(deletePlayerQuery);
    response.send(
        "Player Removed"})
    )
})

module.exports= app;
