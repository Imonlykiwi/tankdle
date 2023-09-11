"use strict";

const template = document.querySelector("#template");
const counterDiv = document.querySelector(".counter");
const tankNameInput = document.querySelector(".form__field");
const tankBtn = document.querySelector(".guess-btn");
const table = document.querySelector(".content");
const tableBody = document.querySelector(".table-content");
const suggestions = document.querySelector(".suggestion");
const modal = new bootstrap.Modal(document.querySelector("#winModal"));

let counter = 0;
let randomTank = null;
let tanks = [];
let tableindex = 0;
let dropDownFlag = false;

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

tankNameInput.addEventListener("input", function (e) {
  const tankNameSearch = e.target.value.toLowerCase();
  suggestions.classList.remove("active");
  suggestions.querySelector(".suggestion-tanks").textContent = "";

  if (tankNameSearch.length >= 3) {
    const matchingTanks = tanks.filter((tank) => {
      return tank.tankName.toLowerCase().includes(tankNameSearch);
    });

    const tankNames = matchingTanks.map((tank) => tank.tankName);

    if (tankNames.length < 1) return;

    function displayArrayIndices(array, list) {
      array.forEach((element, index) => {
        const icons = [
          "../assets/icons/Ico_Heavy.png",
          "../assets/icons/Ico_Medium.png",
          "../assets/icons/Ico_Light.png",
          "../assets/icons/Ico_TD.png",
          "../assets/icons/Ico_SPG.png",
          "../assets/icons/Ico_",
        ];
        const listItem = document.createElement("li");
        const tank = matchingTanks[index]; // Find the corresponding element in the "tanks" array
        const tankTypeComparison = tank.tankType; // Assign the tank type to the variable

        listItem.innerHTML = `${index + 1}. ${element} -  <img src="
        ${(() => {
          switch (tankTypeComparison) {
            case "heavy tank":
              return icons[0];
            case "medium tank":
              return icons[1];
            case "light tank":
              return icons[2];
            case "tank destroyer":
              return icons[3];
            case "self-propelled guns":
              return icons[4];
            default:
              return ""; // Default value if the tank type does not match any caseu
          }
        })()}
        " alt="tank type icon">`;

        list.querySelector(".suggestion-tanks").appendChild(listItem);
      });
    }

    displayArrayIndices(tankNames, suggestions);
    suggestions.classList.add("active"); // Add the "active" class to "suggestions"
    console.log(tankNames);
    dropDownFlag = true;
  } else {
    suggestions.classList.remove("active"); // Remove the "active" class if the input is not active
    dropDownFlag = false;
    return;
  }
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches("section.input") && dropDownFlag) {
    suggestions.classList.remove("active");
    !dropDownFlag;
  }
};
