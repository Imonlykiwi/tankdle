//? The logic responsible for calculating and displaying the result
class Result {
  // Constructor for the Result class that takes a timer, counter, and element as arguments.
  constructor(timer, counter, element) {
    this.timer = timer;     // Initialize timer property.
    this.counter = counter; // Initialize counter property.
    this.element = element; // Initialize element property.
  }

  // Method to calculate and display the result.
  getResult() {
    const finalResult = this.calculateFinalResult(); // Calculate the final result.
    const stars = this.calculateStars(finalResult);   // Calculate the star rating.

    this.openModal(stars); // Display the result using a modal.
  }

  // Method to calculate the final result based on timer and counter values.
  calculateFinalResult() {
    let result = 0;

    // Calculate the result based on the timer value.
    if (this.timer <= 400) {
      result -= 2; // If timer is less than or equal to 400, subtract 2 from the result.
    } else if (this.timer <= 800) {
      result -= 1; // If timer is between 400 and 800, subtract 1 from the result.
    }

    // Calculate the result based on the counter value.
    if (this.counter > 3) {
      switch (this.counter) {
        case 4:
          result += 1;
          break;
        case 5:
          result += 2;
          break;
        case 6:
          result += 4;
          break;
        case 7:
          result += 6;
          break;
        case 8:
          result += 8;
          break;
        default:
          result += 10; // For counters greater than 8, add 10 to the result.
      }
    }

    return result; // Return the calculated final result.
  }

  // Method to calculate the star rating based on the final result.
  calculateStars(finalResult) {
    const starMap = new Map([
      [-2, 6],
      [-1, 5],
      [0, 5],
      [1, 5],
      [2, 5],
      [3, 4],
      [4, 4],
      [5, 3],
      [6, 3],
      [7, 3],
      [8, 2],
      [9, 2],
      [10, 1],
    ]);

    return starMap.get(finalResult) || 0; // Get the star rating from the starMap or default to 0 stars.
  }

  // Method to display stars in the modal element.
  openModal(stars) {
    const starElement = this.createStarElement(true);      // Create a solid star element.
    const emptyStarElement = this.createStarElement(false); // Create an empty star element.

    // Add solid stars to the element based on the star rating.
    for (let i = 0; i < stars; i++) {
      this.element.appendChild(starElement.cloneNode(true));
    }

    // Add empty stars to fill the remaining space up to 5 stars.
    for (let i = stars; i < 5; i++) {
      this.element.appendChild(emptyStarElement.cloneNode(true));
    }
  }

  // Method to create a star element (solid or empty) with appropriate styling.
  createStarElement(isSolid) {
    const starElement = document.createElement("i"); // Create an <i> element for the star.
    starElement.classList.add(isSolid ? "fa-solid" : "fa-regular", "fa-star"); // Add classes for styling.
    starElement.style.color = "#ede219"; // Set the star color to yellow.

    return starElement; // Return the created star element.
  }
}


/**
 * return random tank from array
 * @function
 * @param {Array} tanks tanks array.
 * @returns {{
 * tankName: string,
 * tankTier: string,
 * tankCountry: string,
 * tankType: string
 * tankDPS: number,
 * tankCrew: number,
 * tankHP: number
 * }}
 */

const getRandomTank = (tankArray) => {
  if (tankArray.length === 0) {
    throw new Error("Tank array is empty.");
  }
  const randomIndex = Math.floor(Math.random() * tankArray.length);
  return tankArray.at(randomIndex);
};

/**
 * Checks if the provided tank matches the randomly generated tank.
 * @param {string} name - The name of the tank to check.
 * @param {number} tier - The tier of the tank to check.
 * @param {string} type - The type of the tank to check.
 * @param {string} country - The country of the tank to check.
 * @param {number} dps - The damage per second of the tank to check.
 * @param {number} crew - The number of crew members of the tank to check.
 * @param {number} hp - The hit points of the tank to check.
 * @param {HTMLLIElement[]} list - An array of HTML list items representing the tank properties to check.
 */
const checkTank = (name, tier, type, country, dps, crew, hp, list) => {
  // console.log(arabicTier, romanToArabic(randomTank.tankTier));
  const properties = [
    { name: "tankName", value: name, check: false },
    { name: "tankTier", value: tier, check: true },
    { name: "tankType", value: type, check: false },
    { name: "tankCountry", value: country, check: false },
    { name: "tankDPS", value: dps, check: true },
    { name: "tankCrew", value: crew, check: true },
    { name: "tankHP", value: hp, check: true },
  ];

  //? if we don't guess the name of the tank
  if (name !== randomTank.tankName) {
    properties.forEach(({ name, value, check }, index) => {
      const listItem = list[index + 1];

      if (value !== randomTank[name]) {
        listItem.classList.add("table-danger");
        if (check === true) addArrowToCell(listItem, value, randomTank[name]);
        return;
      }

      listItem.classList.add("table-success");
    });
    return;
  }

  //? if we guess the name of the tank
  list.forEach((listItem) => {
    if (listItem.classList.contains("index")) return;
    listItem.classList.add("table-success");
  });
  blockInput(tankNameInput);
};

//? convert roman number to arabic
function romanToArabic(roman) {
  const romanNumerals = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
    default: 0,
  };

  return romanNumerals[roman] ?? romanNumerals.default;
}

//?  checks if a given string contains a Roman numeral from 1 to 10
function containsRomanNumber(str) {
  // Create a regular expression to match Roman numerals from 1 to 10
  const romanPattern = /^(X|IX|IV|V?I{0,3})$/;
  // Check if the string matches the pattern
  return romanPattern.test(str);
}

//? start couting time
function startTimerOnEvent() {
  // Check if the interval is not already running
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timer++;
      // console.log(timer);
    }, 100);
  }
}

//? Function that stops the timer interval when called
function stopTimerOnEvent() {
  // Check if the interval is running
  if (timerInterval) {
    clearInterval(timerInterval);
    // console.log(timer, counter);
    timerInterval = null; // Reset the interval variable

    // Create an instance of the Result class and pass the timer and counter parameters
    const playerResult = new Result(timer, counter, modalStars);

    // Call the getResult method to calculate the result and display it in the console
    playerResult.getResult();
  }
}
