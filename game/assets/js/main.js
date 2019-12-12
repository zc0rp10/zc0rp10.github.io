const playerAvatar = document.getElementById("player-avatar");
const playerClass = document.getElementById("player-class");
const playerLevel = document.getElementById("player-level");
const playerHealth = document.getElementById("player-health");
const playerMana = document.getElementById("player-mana");

const enemyAvatar = document.getElementById("enemy-avatar");
const enemyHealth = document.getElementById("enemy-health");

const combatLog = document.getElementById("combat-log");

let gamemanager = {
  updateState: function() {
    playerClass.innerHTML = player.charClass;
    playerLevel.innerHTML = player.charLevel;
    playerHealth.innerHTML = player.charHealth;
    playerMana.innerHTML = player.charMana;
    enemyHealth.innerHTML = enemy.charHealth;
  },
  updateCombatLog: function() {
    let date = new Date();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    var hour = date.getHours();
    let paragraph = document.createElement("p");
    paragraph.innerText = `[${hour}:${minutes}:${seconds}] You hit ${enemy.charClass} for ${player.charSkills.attack.damage} damage!`;
    combatLog.appendChild(paragraph);
  },
  checkWin: function() {
    if (enemy.charHealth <= 0) {
      gamemanager.playSound("victory.mp3");
      enemyAvatar.src = "/assets/img/avatars/dead.png";

      let date = new Date();
      let seconds = date.getSeconds();
      let minutes = date.getMinutes();
      var hour = date.getHours();
      let paragraph = document.createElement("p");
      paragraph.innerText = `[${hour}:${minutes}:${seconds}] You have defeated ${enemy.charClass}!`;
      combatLog.appendChild(paragraph);
    }
  },
  playSound: function(sound) {
    var audio = new Audio("./assets/sounds/" + sound);
    audio.play();
  }
};

let player = {
  charClass: "Warrior",
  charAvatar: "warrior.jpg",
  charLevel: 1,
  charHealth: 100,
  charMana: 50,
  charSkills: {
    attack: {
      name: "Attack",
      damage: 50,
      sound: "hit.wav",
      spellImg: "",
      manaCost: 0,
      useSkill: function() {
        enemy.charHealth = enemy.charHealth - player.charSkills.attack.damage;
        player.charMana = player.charMana - player.charSkills.attack.manaCost;
        gamemanager.playSound(player.charSkills.attack.sound);
        gamemanager.updateState();
        gamemanager.updateCombatLog();
        gamemanager.checkWin();
      }
    },
    magic: {
      name: "Fire I",
      damage: 30,
      sound: "fireball.mp3",
      spellImg: "fireball.png",
      manaCost: 8
    },
    block: {
      name: "Ice I",
      damage: 20,
      sound: "ice.wav",
      spellImg: "iceblast.jpg",
      manaCost: 4
    }
  }
};

let enemy = {
  charClass: "Troll",
  charAvatar: "warrior.jpg",
  charLevel: 1,
  charHealth: 200,
  charMana: 100
};

let magic = {
  fire: {
    name: "Fire I",
    damage: 30,
    sound: "fireball.mp3",
    spellImg: "fireball.png",
    mpCost: 8
  },
  ice: {
    name: "Ice I",
    damage: 20,
    sound: "ice.wav",
    spellImg: "iceblast.jpg",
    mpCost: 4
  }
};

playerAvatar.src = "assets/img/avatars/" + player.charAvatar;
playerClass.innerHTML = player.charClass;
playerLevel.innerHTML = player.charLevel;
playerHealth.innerHTML = player.charHealth;
playerMana.innerHTML = player.charMana;

enemyHealth.innerHTML = enemy.charHealth;
