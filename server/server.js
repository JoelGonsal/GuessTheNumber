const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");


const app = express();


app.use(cors());


// PUBLIC FOLDER
app.use(
    express.static(
        path.join(__dirname,"../public")
    )
);



app.get("/",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "../public/index.html"
        )
    );

});



const server =
http.createServer(app);



const io =
new Server(server,{

    cors:{
        origin:"*",
        methods:[
            "GET",
            "POST"
        ]
    }

});





// ===============================
// ROOMS
// ===============================

let rooms = {};





// ===============================
// GENERATE ROOM
// ===============================


function generateRoom(){


    let chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


    let code="";


    for(let i=0;i<6;i++){

        code +=
        chars[
            Math.floor(
                Math.random()*chars.length
            )
        ];

    }


    return code;

}





// ===============================
// SOCKET
// ===============================


io.on(
"connection",
socket=>{


console.log(
"CONNECTED:",
socket.id
);





// ===============================
// CREATE ROOM
// ===============================


socket.on(
"createRoom",
data=>{


let room;


do{

    room =
    generateRoom();

}
while(rooms[room]);




rooms[room]={


    players:[

        {
            id:socket.id,
            name:data.name,
            secret:null
        }

    ],


    turn:null


};




socket.join(room);



socket.emit(
"roomCreated",
{
    room
}
);



console.log(
"ROOM CREATED:",
room
);



});









// ===============================
// JOIN ROOM
// ===============================


socket.on(
"joinRoom",
data=>{


let room =
rooms[data.room];



if(!room){


    socket.emit(
        "errorMessage",
        "Room not found"
    );


    return;

}



if(room.players.length >= 2){


    socket.emit(
        "errorMessage",
        "Room full"
    );


    return;

}




room.players.push({

    id:socket.id,

    name:data.name,

    secret:null

});




socket.join(data.room);



socket.emit(
"joinedRoom",
{
    room:data.room
}
);





io.to(data.room)
.emit(
"playerJoined",
{
    name:data.name
}
);




console.log(
"PLAYER JOINED:",
data.name
);




// IMPORTANT FIX
// START SECRET SELECTION

io.to(data.room)
.emit(
"startGame"
);



});









// ===============================
// SET SECRET
// ===============================


socket.on(
"setSecret",
data=>{


let room =
rooms[data.room];



if(!room)
return;




let player =
room.players.find(
p=>p.id===socket.id
);



if(!player)
return;



let secret =
Number(data.secret);



if(
secret < 0 ||
secret > 999
){

socket.emit(
"errorMessage",
"Number must be between 0 and 999"
);

return;

}



player.secret =
secret;




console.log(
player.name,
"selected",
secret
);






// BOTH READY

if(
room.players.length===2 &&
room.players.every(
p=>p.secret !== null
)

){



room.turn =
room.players[0].id;



console.log(
"GAME START",
room.turn
);



io.to(data.room)
.emit(
"gameStarted",
{
    turn:room.turn
}
);



}



});









// ===============================
// GUESS
// ===============================


socket.on(
"guess",
data=>{


let room =
rooms[data.room];



if(!room)
return;



if(
room.turn !== socket.id
)
return;




let opponent =
room.players.find(
p=>p.id!==socket.id
);



if(!opponent)
return;




let guess =
Number(data.guess);



let result;



if(
guess > opponent.secret
){

    result="high";

}

else if(
guess < opponent.secret
){

    result="low";

}

else{

    result="correct";

}





socket.emit(
"guessResult",
{

result,

value:guess

}

);






if(result==="correct"){



let winner =
room.players.find(
p=>p.id===socket.id
);



io.to(data.room)
.emit(
"winner",
{
    name:winner.name
}
);



return;

}





room.turn =
opponent.id;




io.to(data.room)
.emit(
"turn",
room.turn
);





io.to(opponent.id)
.emit(
"opponentThinking"
);



});









// ===============================
// NEW ROUND
// ===============================


socket.on(
"newRound",
roomCode=>{


let room =
rooms[roomCode];



if(!room)
return;




room.players.forEach(
player=>{

    player.secret=null;

}

);



room.turn=null;



io.to(roomCode)
.emit(
"startGame"
);



});









// ===============================
// DISCONNECT
// ===============================


socket.on(
"disconnect",
()=>{


console.log(
"DISCONNECTED:",
socket.id
);



for(
let roomCode in rooms
){


let room =
rooms[roomCode];



room.players =
room.players.filter(
p=>p.id!==socket.id
);




if(
room.players.length===0
){

delete rooms[roomCode];

}

else{


io.to(roomCode)
.emit(
"errorMessage",
"Opponent disconnected"
);


}



}



});






});







const PORT = process.env.PORT || 3000;


server.listen(
PORT,
()=>{

console.log(
`SERVER RUNNING ON ${PORT}`
);

});