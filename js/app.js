"use strict";

// Get references to various elements in the HTML
const template = document.querySelector("#template");
const counterDiv = document.querySelector(".counter");
const tankNameInput = document.querySelector(".form__field");
const tankBtn = document.querySelector(".guess-btn");
const table = document.querySelector(".content");
const tableBody = document.querySelector(".table-content");
const suggestions = document.querySelector(".suggestion");
const modalBody = document.querySelector(".modal-body");
const modalStars = document.querySelector(".modal-stars");
const modal = new bootstrap.Modal(document.querySelector("#winModal"));

// Initialize variables
let counter = 0;
let randomTank = null;
let tanks = [];
let tableindex = 0;
let dropDownFlag = false;
let timer = 0;
let timerInterval;

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
  if (!containsRomanNumber(status1)) {
    (status1 < status2) && arrow.classList.add("rotate-180");
  } else {
    (romanToArabic(status1) > romanToArabic(status2)) && arrow.classList.add("rotate-180");
    // console.log(romanToArabic(status1), romanToArabic(status2));
  }
  
  cell.appendChild(arrow);
};

// Function to create a row for a tank in the table
const createTankRow = (templateList, templateContent, tank, tableindex) => {
  const tankProperties = [
    tableindex,
    tank.tankName,
    tank.tankTier,
    tank.tankType,
    tank.tankCountry,
    tank.tankDPS,
    tank.tankCrew,
    tank.tankHP,
  ];

  for (let i = 0; i < templateList.length; i++) {
    templateList[i].textContent = tankProperties[i];
  }

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
      if (counter === 10) {
        blockInput(tankNameInput, false);
      }
      counterDiv.querySelector("span").textContent = counter;

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
const blockInput = (input, res = true) => {
  input.disabled = true;
  modalBody.textContent = res ? 'Wygrałeś!' : 'Przegraleś!';
  console.log(res);
  modal.toggle();
  stopTimerOnEvent();
};

// Event listener for input changes in the tank name input field
tankNameInput.addEventListener("input", function (e) {
  startTimerOnEvent(); //start timer
  const tankNameSearch = e.target.value.toLowerCase();
  suggestions.classList.remove("active");
  suggestions.querySelector(".suggestion-tanks").textContent = "";

  if (tankNameSearch.length >= 3) {
    const matchingTanks = tanks.filter((tank) => {
      return tank.tankName.toLowerCase().includes(tankNameSearch);
    });

    const tankNames = matchingTanks.map((tank) => tank.tankName);

    if (tankNames.length === 0) return;

    //? Create a list of tanks suggestions based on the user input
    tankNames.forEach((element, index) => {
      const icons = {
        "heavy tank": "../assets/img/icons/Ico_Heavy.png",
        "medium tank": "../assets/img/icons/Ico_Medium.png",
        "light tank": "../assets/img/icons/Ico_Light.png",
        "tank destroyer": "../assets/img/icons/Ico_TD.png",
        "self-propelled guns": "../assets/img/icons/Ico_SPG.png",
        default: "../assets/img/icons/Question.png", //? Default value if the tank type does not match any case
      };
      const listItem = document.createElement("li");
      const tank = matchingTanks[index];

      listItem.innerHTML = `${index + 1}. ${element}  <img src="${
        icons[tank.tankType] || icons.default
      }" alt="tank type icon" class="tank-icon">`;

      suggestions.querySelector(".suggestion-tanks").appendChild(listItem);

      listItem.addEventListener("click", function () {
        tankNameInput.value = element;
      });
    });

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
    // console.log(dropDownFlag);
  }
};
