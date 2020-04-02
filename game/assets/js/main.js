const playerAvatar = document.getElementById("player-avatar");
const playerClass = document.getElementById("player-class");
const playerLevel = document.getElementById("player-level");
const playerHealth = document.getElementById("player-health");
const playerMana = document.getElementById("player-mana");

const enemyAvatar = document.getElementById("enemy-avatar");
const enemyHealth = document.getElementById("enemy-health");

const combatLog = document.getElementById("combat-log");
const activeSpell = document.getElementById("active-spell");

let fightActive = true;

let enemy = {
  charClass: "Troll",
  charAvatar: "troll.jpg",
  charLevel: 1,
  charHealth: 300,
  charMana: 100
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
      spellImg: "slash1.png",
      manaCost: 0,
      useAttack: function() {
        if (fightActive === true) {
          enemy.charHealth = enemy.charHealth - player.charSkills.attack.damage;
          player.charMana = player.charMana - player.charSkills.attack.manaCost;
          gamemanager.playSound(player.charSkills.attack.sound);
          gamemanager.updateState();
          gamemanager.updateCombatLog("attack");
          gamemanager.checkWin();
          activeSpell.src =
            "./assets/img/spells/" + player.charSkills.attack.spellImg;
          setTimeout(function() {
            activeSpell.src = "./assets/img/spells/slash2.png";
            gamemanager.playSound(player.charSkills.attack.sound);
          }, 300);
          setTimeout(function() {
            activeSpell.src = "";
          }, 600);
        }
      }
    },
    magic: {
      name: "Fire I",
      damage: 120,
      sound: "fireball.mp3",
      spellImg: "fireball.png",
      manaCost: 30,
      useMagic: function() {
        if (
          fightActive === true &&
          player.charMana - player.charSkills.magic.manaCost >= 0
        ) {
          enemy.charHealth = enemy.charHealth - player.charSkills.magic.damage;
          player.charMana = player.charMana - player.charSkills.magic.manaCost;
          gamemanager.playSound(player.charSkills.magic.sound);
          gamemanager.updateState();
          gamemanager.updateCombatLog("magic");
          gamemanager.checkWin();
          activeSpell.src =
            "./assets/img/spells/" + player.charSkills.magic.spellImg;
          setTimeout(function() {
            activeSpell.src = "";
          }, 800);
        } else {
          gamemanager.playSound("nomana.mp3");
        }
      }
    },
    block: {
      name: "Ice I",
      damage: 90,
      sound: "ice.wav",
      spellImg: "iceblast.jpg",
      manaCost: 20,
      useBlock: function() {
        if (
          fightActive === true &&
          player.charMana - player.charSkills.block.manaCost >= 0
        ) {
          enemy.charHealth = enemy.charHealth - player.charSkills.block.damage;
          player.charMana = player.charMana - player.charSkills.block.manaCost;
          gamemanager.playSound(player.charSkills.block.sound);
          gamemanager.updateState();
          gamemanager.updateCombatLog("block");
          gamemanager.checkWin();
          activeSpell.src =
            "./assets/img/spells/" + player.charSkills.block.spellImg;
          setTimeout(function() {
            activeSpell.src = "";
          }, 800);
        } else {
          gamemanager.playSound("nomana.mp3");
        }
      }
    }
  }
};

let magic = {
  fire: {
    name: "Fire I",
    damage: 120,
    sound: "fireball.mp3",
    spellImg: "fireball.png",
    mpCost: 8
  },
  ice: {
    name: "Ice I",
    damage: 90,
    sound: "ice.wav",
    spellImg: "iceblast.jpg",
    mpCost: 4
  }
};

playerAvatar.src = "./assets/img/avatars/" + player.charAvatar;
playerClass.innerHTML = player.charClass;
playerLevel.innerHTML = player.charLevel;
playerHealth.innerHTML = player.charHealth;
playerMana.innerHTML = player.charMana;

enemyAvatar.src = "./assets/img/avatars/" + enemy.charAvatar;
enemyHealth.innerHTML = enemy.charHealth;

let gamemanager = {
  updateState: function() {
    playerClass.innerHTML = player.charClass;
    playerLevel.innerHTML = player.charLevel;
    playerHealth.innerHTML = player.charHealth;
    playerMana.innerHTML = player.charMana;
    enemyHealth.innerHTML = enemy.charHealth;
  },
  updateCombatLog: function(msgType) {
    let date = new Date();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    var hour = date.getHours();
    let paragraph = document.createElement("p");
    switch (msgType) {
      case "attack":
        paragraph.innerText = `[${hour}:${minutes}:${seconds}] You hit ${enemy.charClass} for ${player.charSkills.attack.damage} damage!`;
        break;
      case "magic":
        paragraph.innerHTML = `[${hour}:${minutes}:${seconds}] ${player.charClass} casts ${player.charSkills.magic.name} on ${enemy.charClass} for ${player.charSkills.magic.damage} damage!`;
        break;
      case "block":
        paragraph.innerHTML = `[${hour}:${minutes}:${seconds}] ${player.charClass} casts ${player.charSkills.block.name} on ${enemy.charClass} for ${player.charSkills.block.damage} damage!`;
        break;
    }

    combatLog.appendChild(paragraph);
  },
  checkWin: function() {
    if (enemy.charHealth <= 0) {
      gamemanager.playSound("victory.mp3");
      enemyAvatar.src = "./assets/img/avatars/dead.png";
      fightActive = false;

      let date = new Date();
      let seconds = date.getSeconds();
      let minutes = date.getMinutes();
      var hour = date.getHours();
      let paragraph = document.createElement("p");
      paragraph.innerText = `[${hour}:${minutes}:${seconds}] You have defeated ${enemy.charClass}!`;
      combatLog.appendChild(paragraph);
      let paragraph2 = document.createElement("p");
      paragraph2.innerText = `[${hour}:${minutes}:${seconds}] You gained 32 XP and found 12 Gold!`;
      combatLog.appendChild(paragraph2);
    }
  },
  playSound: function(sound) {
    var audio = new Audio("./assets/sounds/" + sound);
    audio.play();
  }
};
