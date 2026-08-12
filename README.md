# 🎯 Joel's Number Guessing Game

A real-time multiplayer number guessing game where two players create or join a private room, choose secret numbers, and take turns trying to guess each other's number.

🌐 Live Demo: https://guessthenumber-cgup.onrender.com

## ✨ Features

* 🎮 Two-player multiplayer gameplay
* 🏠 Create and join private rooms
* 🔐 Choose a secret number from 0–999
* 🎯 Turn-based guessing
* 📈 Dynamic range hints
* 📝 Guess history
* 🔄 Play multiple rounds
* 🏆 Winner detection
* 📋 Copy room code
* 🔌 Real-time communication using Socket.IO
* 🚪 Automatic handling of disconnected players

## 🛠️ Technologies

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* Socket.IO

## 🎮 How to Play

### 1. Create a Room

Enter your name and click **Create Room**.

A unique 6-character room code will be generated.

### 2. Join the Room

Share the room code with another player.

The second player enters their name and the room code to join.

Each room supports a maximum of two players.

### 3. Choose Your Secret Number

Both players select a secret number between `0` and `999`.

The selected number remains hidden from the opponent.

### 4. Start Guessing

Players take turns entering guesses.

The game provides hints:

* `Too High` — your guess is higher than the opponent's number.
* `Too Low` — your guess is lower than the opponent's number.
* `Correct` — you guessed the secret number.

The possible range is updated after every guess.

### 5. Win the Game

The first player to correctly guess the opponent's secret number wins the round.

You can then start another round or reset the game.

## ⚙️ How It Works

```text
Player 1
   │
   ├── Create Room
   │
   ▼
Socket.IO Server
   │
   │ Room Code
   ▼
Player 2
   │
   └── Join Room

        ↓

Both Players Choose
Secret Numbers

        ↓

   Turn-Based Game

        ↓

 Guess → High / Low

        ↓

 Correct Guess

        ↓

      Winner 🏆
```

The server maintains the room, players, secret numbers, and current turn in memory.

## 📁 Project Structure

```text
GuessTheNumber/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── server/
│   └── server.js
│
├── package.json
└── README.md
```

## 🚀 Run Locally

Clone the repository:

```bash
git clone <repository-url>
cd GuessTheNumber
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

## 🔄 Real-Time Communication

Socket.IO handles communication between the players and server.

Important events include:

* `createRoom`
* `joinRoom`
* `setSecret`
* `guess`
* `gameStarted`
* `guessResult`
* `turn`
* `winner`
* `newRound`

The server validates the player's turn before processing a guess, and the game state is maintained separately for each room.

## 🌐 Deployment

The application is deployed on Render:

https://guessthenumber-cgup.onrender.com

## 📌 Notes

* Each room supports two players.
* Room data is stored in server memory.
* No database is currently used.
* A room is removed when all players disconnect.
* The game uses Socket.IO for real-time multiplayer functionality.

---

Made with ❤️ by Joel
