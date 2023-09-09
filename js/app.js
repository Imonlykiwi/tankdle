"use strict";

const template = document.querySelector("#template");
const counterDiv = document.querySelector(".counter");
const tankNameInput = document.querySelector(".form__field");
const tankBtn = document.querySelector(".guess-btn");
const table = document.querySelector(".content");
const modal = new bootstrap.Modal(document.querySelector("#winModal"));
const tableBody = document.querySelector(".table-content");

let counter = 0;
let randomTank = null;
let tanks = [];
let tableindex = 0;

fetch("../assets/data/tanks-list.json")
  .then((response) => response.json())
  .then((data) => {
    for (const tankKey in data) {
      const tank = data[tankKey];
      tanks.push({
        tankName: tank.name,
        tankTier: tank.stats.tier,
        tankCountry: tank.stats.country,
        tankType: tank.stats.type,
        tankDPS: tank.stats.dps,
        tankCrew: tank.stats.crew,
        tankHP: tank.stats.hp,
      });
    }
    randomTank = getRandomTank(tanks);
    console.log(randomTank);
  })
  .catch((error) => {
    console.error("Błąd wczytywania danych z pliku JSON:", error);
  });

const addArrowToCell = (cell, status1, status2) => {
  const arrow = document.createElement("i");
  arrow.classList.add("fa-solid", "fa-arrow-down");
  arrow.style.marginLeft = "8px";
  if (status1 < status2) {
    arrow.classList.add("rotate-180");
  }
  cell.appendChild(arrow);
};



const createTankRow = (templateList, templateContent, tank, tableindex) => {
  console.log(templateList);
  templateList[0].textContent = tableindex;
  templateList[1].textContent = tank.tankName;
  templateList[2].textContent = tank.tankTier;
  templateList[3].textContent = tank.tankType;
  templateList[4].textContent = tank.tankCountry;
  templateList[5].textContent = tank.tankDPS;
  templateList[6].textContent = tank.tankCrew;
  templateList[7].textContent = tank.tankHP;

  tableBody.appendChild(templateContent);
};

tankBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const guessedName = tankNameInput.value;
  if (!guessedName) {
    tankNameInput.value = "";
    return;
  }

  tanks.forEach((tank) => {
    if (tank.tankName.toLowerCase() === guessedName.toLowerCase()) {

      //? increments counter for guessed tanks
      tableindex++;
      counter++;
      counterDiv.textContent = counter;

      const templateContent = document.importNode(template.content, true);
      const templateList = templateContent.querySelectorAll(".list");
    
      createTankRow(templateList, templateContent, tank, tableindex);
    
      checkTank(
        tank.tankName,
        tank.tankTier,
        tank.tankType,
        tank.tankCountry,
        tank.tankDPS,
        tank.tankCrew,
        tank.tankHP,
        templateList
      );
      tankNameInput.value = "";
    }
  });
});

const blockInput = (input) => {
  input.disabled = true;
  modal.toggle();
};
