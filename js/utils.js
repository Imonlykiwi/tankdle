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
  return tankArray.at(Math.floor(Math.random() * tankArray.length));
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
