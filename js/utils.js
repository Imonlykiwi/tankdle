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
    throw new Error('Tank array is empty.');
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
    "I": 1,
    "II": 2,
    "III": 3,
    "IV": 4,
    "V": 5,
    "VI": 6,
    "VII": 7,
    "VIII": 8,
    "IX": 9,
    "X": 10,
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
