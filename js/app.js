"use strict";

// Get references to various elements in the HTML
const template = document.querySelector("#template");
const counterDiv = document.querySelector(".counter");
const tankNameInput = document.querySelector(".form__field");
const tankBtn = document.querySelector(".guess-btn");
const table = document.querySelector(".content");
const tableBody = document.querySelector(".table-content");
const suggestions = document.querySelector(".suggestion");
const modal = new bootstrap.Modal(document.querySelector("#winModal"));

// Initialize variables
let counter = 0;
let randomTank = null;
let tanks = [];
let tableindex = 0;
let dropDownFlag = false;

// Fetch tank data from a JSON file
fetch("../assets/data/tanks-list.json")
  .then((response) => response.json())
  .then((data) => {
    // Parse the JSON data and populate the "tanks" array
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
    // Select a random tank from the "tanks" array
    randomTank = getRandomTank(tanks);
    // console.log(randomTank);
  })
  .catch((error) => {
    console.error("Error loading data from JSON file:", error);
  });

// Function to add an arrow icon to a table cell based on values
const addArrowToCell = (cell, status1, status2) => {
  const arrow = document.createElement("i");
  arrow.classList.add("fa-solid", "fa-arrow-down");
  arrow.style.marginLeft = "8px";
  if (status1 < status2) {
    arrow.classList.add("rotate-180");
  }
  cell.appendChild(arrow);
};

// Function to create a row for a tank in the table
const createTankRow = (templateList, templateContent, tank, tableindex) => {
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

// Event listener for the tank guessing button
tankBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const guessedName = tankNameInput.value;
  if (!guessedName) {
    tankNameInput.value = "";
    return;
  }

  tanks.forEach((tank) => {
    if (tank.tankName.toLowerCase() === guessedName.toLowerCase()) {
      // Increment the counter for guessed tanks
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

// Function to block user input and display a modal
const blockInput = (input) => {
  input.disabled = true;
  modal.toggle();
};

// Event listener for input changes in the tank name input field
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
          "../assets/img/icons/Ico_Heavy.png",
          "../assets/img/icons/Ico_Medium.png",
          "../assets/img/icons/Ico_Light.png",
          "../assets/img/icons/Ico_TD.png",
          "../assets/img/icons/Ico_SPG.png",
          "../assets/img/icons/Question.png",
        ];

        const listItem = document.createElement("li");
        const tank = matchingTanks[index];
        const tankTypeComparison = tank.tankType;

        listItem.innerHTML = `${index + 1}. ${element}  <img src="${(() => {
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
              return icons[5]; // Default value if the tank type does not match any case
          }
        })()}" alt="tank type icon" class="tank-icon">`;

        listItem.setAttribute("data-name", element);

        list.querySelector(".suggestion-tanks").appendChild(listItem);

        listItem.addEventListener("click", function () {
          tankNameInput.value = element;
        });
      });
    }

    displayArrayIndices(tankNames, suggestions);
    suggestions.classList.add("active");
    dropDownFlag = true;
  } else {
    suggestions.classList.remove("active");
    dropDownFlag = false;
    return;
  }
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches("section.input") && dropDownFlag) {
    suggestions.classList.remove("active");
    dropDownFlag = false;
  }
};
