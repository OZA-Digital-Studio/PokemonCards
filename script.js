"use strict";

// DECLARATIONS

const ability = document.querySelector(".ability");
const attack1 = document.querySelector(".attack1");
const attack2 = document.querySelector(".attack2");
const attackName = document.querySelector(".attackName");
const back = document.querySelector(".arrow");
const card = document.querySelector(".card");
const cardAncient = document.querySelector(".cardAncient");
const cardArtist = document.getElementById("cardArtist");
const cardCode = document.getElementById("code");
const cardEvol = document.getElementById("evol");
const cardImg = document.querySelector(".cardImg");
const cardInfo = document.querySelector(".cardInfo");
const cardName = document.querySelector(".cardName");
const cardNr = document.getElementById("cardNr");
const cardPage = document.querySelector(".cardViewer");
const cardSeries = document.getElementById("series");
const cardSet = document.getElementById("set");
const cardType = document.getElementById("type");
const listContainer = document.querySelector(".listContainer");
const resistance = document.querySelector(".resistance");
const retreat = document.querySelector(".retreat");
const searchBtn = document.getElementById("searchBtn");
const superSubtype = document.getElementById("superSubtype");
const symbols = ["🍃", "🔥", "🌊", "⚡", "👁️", "✊", "👥", "⚙️", "🌷", "⚪"];
const text = document.querySelector(".text");
const types = [
  "Grass",
  "Fire",
  "Water",
  "Lightning",
  "Psychic",
  "Fighting",
  "Darkness",
  "Metal",
  "Fairy",
  "Colorless",
];
const weakness = document.querySelector(".weaknesses");

//------------------------------------------------------------------------------------------

// FUNCTIONS

// Display card
function _displayCard(c) {
  const x = _getCard(c);

  // IMAGE
  cardImg.src = x.imageUrlHiRes;

  // HEADER: CARD NAME + SUBTYPE + SUPERTYPE + RARITY + HP
  const hp = x.hp ? `HP ${x.hp}` : "";
  const symbol = x.types ? symbols[types.indexOf(...x.types)] : "";
  const rarity = x.rarity ? `__ ${x.rarity}` : "";

  cardName.textContent = x.name;
  cardType.textContent = `${hp} ${symbol}`;
  superSubtype.textContent = `${x.subtype.toUpperCase()} ${x.supertype.toUpperCase()} ${rarity}`;

  // TEXT
  if (x.text) text.textContent = x.text;

  // ABILITY
  if (x.ability) {
    ability.style.display = "flex";
    document.querySelector(
      ".abilityName"
    ).textContent = x.ability.name.toUpperCase();
    document.querySelector(".abilityText").textContent = x.ability.text;
    document.querySelector(".abilityType").textContent = x.ability.type;
  }

  // CARD ATTACK
  function _attackInfo(index) {
    // Name
    if (x.attacks[index - 1].name)
      document.querySelector(`.attackName${index}`).textContent = `${
        x.attacks[index - 1].name
      }`;

    // Cost
    if (x.attacks[index - 1].cost)
      document.querySelector(`.attackCost${index}`).textContent = findEmoji(
        x.attacks[index - 1].cost
      );

    // Text
    if (x.attacks[index - 1].text)
      document.querySelector(`.attackText${index}`).textContent =
        x.attacks[index - 1].text;

    // Damage
    if (x.attacks[index - 1].damage)
      document.querySelector(`.attackDamage${index}`).textContent =
        x.attacks[index - 1].damage;
  }

  if (x.attacks) {
    const [...nrAttacks] = x.attacks;
    attack1.style.display = "flex";
    _attackInfo(1);

    if (nrAttacks.length === 2) {
      attack2.style.display = "flex";
      _attackInfo(2);
    }
  }

  // WEAKNESSES
  if (x.weaknesses) {
    const weaks = x.weaknesses.map(
      (w) => `${symbols[types.indexOf(w.type)]} ${w.value}`
    );
    weakness.textContent = splitArray(weaks);
  }

  //RESISTANCE
  if (x.resistances) {
    const resists = x.resistances.map(
      (r) => `${symbols[types.indexOf(r.type)]} ${r.value}`
    );
    resistance.textContent = splitArray(resists);
  }

  //RETREAT
  if (x.retreatCost) retreat.textContent = findEmoji(x.retreatCost);

  // Evolution + Ancient Trait
  if (x.evolvesFrom) cardEvol.textContent = `Evolves from ${x.evolvesFrom}`;
  if (x.ancientTrait)
    cardAncient.textContent = `Ancient Trait ${x.ancientTrait}`;

  // CARD FOOTER
  cardArtist.textContent = `Artist: ${x.artist}`;
  cardSeries.textContent = `Series: ${x.series}`;
  cardSet.textContent = `Set: ${x.set}`;
  cardCode.textContent = `Code: ${x.setCode}`;
  cardNr.textContent = x.number;

  // Display it!
  _displayToggle();
}

// Display either section 1 or 2
function _displayToggle() {
  listContainer.style.display === "none" ? _showList() : _showCard();
}

// Display error message
function _errorMsg(el) {
  el.textContent = `👾 Whoops! Something went wrong. Try again!`;
  el.classList.add("errorMsg");
}

// Find the emoji which corresponds to each symbol
function findEmoji(arr) {
  const emojis = arr.map((el) => symbols[types.indexOf(el)]);
  return splitArray(emojis);
}

// Get all cards data from local storage
function _getAllCards() {
  const [...cardsData] = JSON.parse(localStorage.getItem("cardsData"));
  cardsData.map((card) => card.name.toLowerCase());
  return cardsData;
}

// Get clicked/searched card data from local storage
function _getCard(searchInput) {
  const cardsData = _getAllCards();
  const names = cardsData.map((card) => card.name.toLowerCase());
  const selectedCard = cardsData[names.indexOf(searchInput)];
  return selectedCard;
}

// Get cards info from API and load their names to the listContainer section
async function _getCardsAPI() {
  try {
    const data = await fetch("https://api.pokemontcg.io/v1/cards");
    if (!data) throw new Error();
    const cards = await data.json();
    const cardsData = await [...Object.values(cards)][0];
    const names = await cardsData.map((card) => card.name).sort();

    names.forEach(function (name) {
      const html = `<button type= "button" class="cardButton" id="${name.toLowerCase()}">${name}</button>`;
      listContainer.insertAdjacentHTML("beforeend", html);

      // Save cards data into the local storage. This avoid having to make an AJAX call for each card button click. Saving it into a local storage is not really a good practice as the file is not safe. I do not know how to use Redux...yet!
      const save = JSON.stringify(cardsData);
      localStorage.setItem("cardsData", save);

      return cardsData;
    });
  } catch (err) {
    _errorMsg(listContainer);
    listContainer.style.display = "none";
    cardInfo.style.display = "none";
    back.addEventListener("click", _errorMsg(cardPage));
    console.log(err);
  }
}

// Display section 2: Card image and information
function _showCard() {
  if (cardName.textContent) {
    listContainer.style.display = "none";
    cardPage.style.display = "flex";
  }
}

// Display section 1: List of card names
function _showList() {
  listContainer.style.display = "flex";
  cardPage.style.display = "none";
  attack1.style.display = "none";
  attack2.style.display = "none";
}

// Create a string from an array of symbols removing commas
function splitArray(el) {
  return el.toString().replace(/,/g, " ");
}

//------------------------------------------------------------------------------------------

// EVENT LISTENERS

// On mouse-click, load the  image and information related to the selected card
listContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.type !== "button") return;

  document.getElementById(e.target.id).style.border = "2px solid white";

  const clickedCard = e.target.textContent.toLowerCase();
  const cardsData = _getAllCards();
  _displayCard(clickedCard);
});

// On arrow-click, toggle between section 1 and 2
back.addEventListener("click", () => _displayToggle());

// Click on the Space-key to return to section 1
document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    e.preventDefault();
    _showList();
  }
};

// Search card by name
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.id !== "searchBtn") return;

  const searchRequest = document
    .getElementById("searchBar")
    .value.toLowerCase();

  _displayCard(searchRequest);

  document.getElementById(searchRequest).style.border = "2px solid white";
});

//-------------------------------------------------------------------

// GLOBAL EXECUTION
_getCardsAPI();
