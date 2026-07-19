// ======================================================
// JOEL'S NUMBER GUESSING GAME
// FINAL FIXED APP.JS
// ======================================================


const socket = io();


// ================= VARIABLES =================


let roomCode = "";
let playerName = "";

let mySecret = "";
let currentGuess = "";

let attempts = 0;

let myTurn = false;

let minValue = 0;
let maxValue = 100;



// ================= ELEMENTS =================


const screens=document.querySelectorAll(".screen");


const playerNameInput=document.getElementById("playerName");
const roomInput=document.getElementById("roomInput");

const roomCodeText=document.getElementById("roomCode");
const myNameText=document.getElementById("myName");

const opponentName=document.getElementById("opponentName");
const opponentStatus=document.getElementById("opponentStatus");

const secretDisplay=document.getElementById("secretDisplay");
const guessDisplay=document.getElementById("guessDisplay");

const attemptsText=document.getElementById("attempts");

const hint=document.getElementById("hint");

const minRange=document.getElementById("minRange");
const maxRange=document.getElementById("maxRange");

const history=document.getElementById("history");

const opponentThinking=document.getElementById("opponentThinking");



// ================= SCREEN =================


function showScreen(screen){

    screens.forEach(s=>{
        s.classList.add("hidden");
    });

    screen.classList.remove("hidden");

}




// ================= CREATE ROOM =================


document.getElementById("createBtn").onclick=()=>{


    playerName=
    playerNameInput.value.trim();


    if(!playerName){

        alert("Enter name");
        return;

    }


    socket.emit(
        "createRoom",
        {
            name:playerName
        }
    );


};





// ================= JOIN ROOM =================


document.getElementById("joinBtn").onclick=()=>{


    playerName=
    playerNameInput.value.trim();


    roomCode=
    roomInput.value.trim().toUpperCase();



    if(!playerName || !roomCode){

        alert("Enter details");
        return;

    }



    socket.emit(
        "joinRoom",
        {
            name:playerName,
            room:roomCode
        }
    );


};






// ================= ROOM =================


socket.on(
"roomCreated",
data=>{


    roomCode=data.room;

    openLobby();


});




socket.on(
"joinedRoom",
data=>{


    roomCode=data.room;

    openLobby();


});





function openLobby(){


    showScreen(lobby);


    roomCodeText.innerText=roomCode;

    myNameText.innerText=playerName;


}






document.getElementById("copyBtn").onclick=()=>{


    navigator.clipboard.writeText(roomCode);

    alert("Copied");


};






// ================= PLAYER JOIN =================


socket.on(
"playerJoined",
data=>{


    opponentName.innerText=data.name;

    opponentStatus.innerText="Connected";

    opponentStatus.classList.remove("waiting");


});







// ================= SECRET =================


socket.on(
"startGame",
()=>{


    mySecret="";

    currentGuess="";

    secretDisplay.innerText="0";

    showScreen(secretScreen);


    createNumberPad(
        "secretPad",
        true
    );


});







function createNumberPad(id,isSecret){


    const pad=document.getElementById(id);


    pad.innerHTML="";



    for(let i=0;i<=9;i++){


        let btn=document.createElement("button");


        btn.innerText=i;



        btn.onclick=()=>{


            if(isSecret){


                if(mySecret.length<3){

                    if(mySecret==="0")
                        mySecret="";


                    mySecret+=i;

                    secretDisplay.innerText=mySecret;


                }


            }



            else{


                if(currentGuess.length<3){


                    if(currentGuess==="0")
                        currentGuess="";


                    currentGuess+=i;

                    guessDisplay.innerText=currentGuess;


                }


            }


        };



        pad.appendChild(btn);


    }


}






// ================= CONFIRM SECRET =================


document.getElementById("secretBtn").onclick=()=>{


    if(mySecret===""){

        alert("Select number");

        return;

    }



    socket.emit(
        "setSecret",
        {

            room:roomCode,

            secret:Number(mySecret)

        }
    );


};
// ================= GAME START =================


socket.on(
"gameStarted",
data=>{


    attempts=0;

    attemptsText.innerText="0";


    minValue=0;
    maxValue=100;


    minRange.innerText="0";
    maxRange.innerText="100";


    history.innerHTML="";


    currentGuess="";

    guessDisplay.innerText="0";


    showScreen(gameScreen);



    createNumberPad(
        "guessPad",
        false
    );



    myTurn =
    data.turn===socket.id;



    updateTurn();


});






function updateTurn(){


    if(myTurn){


        hint.innerText="Your Turn";


        opponentThinking.classList.add(
            "hidden"
        );


    }

    else{


        hint.innerText="Opponent Turn";


    }


}







// ================= GUESS =================


document.getElementById("guessBtn").onclick=()=>{


    if(!myTurn)
        return;



    if(currentGuess==="")
        return;



    let value =
    Number(currentGuess);



    socket.emit(
        "guess",
        {

            room:roomCode,

            guess:value

        }
    );



    currentGuess="";


    guessDisplay.innerText="0";



};







// ================= GUESS RESULT =================


socket.on(
"guessResult",
data=>{


    attempts++;


    attemptsText.innerText=attempts;



    let text="";



    if(data.result==="high"){


        text="Too High";


        maxValue=
        data.value-1;


    }



    else if(data.result==="low"){


        text="Too Low";


        minValue=
        data.value+1;


    }



    else{


        text="Correct";


    }




    minRange.innerText=minValue;

    maxRange.innerText=maxValue;



    hint.innerText=text;



    addHistory(
        data.value+" : "+text
    );



});







// ================= TURN =================


socket.on(
"turn",
id=>{


    myTurn =
    id===socket.id;



    updateTurn();


});








// ================= OPPONENT THINKING =================


socket.on(
"opponentThinking",
()=>{


    opponentThinking.classList.remove(
        "hidden"
    );


});









// ================= HISTORY =================


function addHistory(text){


    let div=
    document.createElement("div");


    div.innerText=text;


    history.prepend(div);


}








// ================= WINNER =================


socket.on(
"winner",
data=>{


    showScreen(winnerScreen);



    document.getElementById("winnerText")
    .innerText =
    data.name+" Wins 🎉";



});







// ================= NEW ROUND =================


document.getElementById("newRoundBtn").onclick=()=>{


    socket.emit(
        "newRound",
        roomCode
    );


};




document.getElementById("playAgainBtn").onclick=()=>{


    socket.emit(
        "newRound",
        roomCode
    );


};






document.getElementById("resetBtn").onclick=()=>{


    location.reload();


};








// ================= ERRORS =================


socket.on(
"gameError",
msg=>{


    alert(msg);


});



socket.on(
"errorMessage",
msg=>{


    alert(msg);


});






// ================= CONNECTION =================


socket.on(
"connect",
()=>{


    console.log(
        "CONNECTED:",
        socket.id
    );


});

