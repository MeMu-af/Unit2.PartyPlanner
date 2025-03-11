const COHORT = "2502-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#partyList");
const partyForm = document.querySelector("#partyForm");
partyForm.addEventListener("submit", addParty);
partyList.addEventListener("click", deleteParty);

// Fetch party data from the API and render it
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);

    state.parties = json.data;
    console.log(json.data);
  } catch (error) {
    console.log(error);
  }
}

async function render() {
  await getParties();
  renderPartyList();
}
render();

// Handle form submission
async function addParty(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const date = new Date(document.querySelector("#date").value);
  const location = document.querySelector("#location").value;
  const description = document.querySelector("#description").value;

  // Create a new party object
  const newParty = {
    name,
    date,
    location,
    description,
  };

  // Send a POST request to add the new party
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParty),
    });
    const json = await response.json();
    console.log(json.data);

    // Add the new party to the party list
    renderParty(json.data);

    // Clear the form inputs
    partyForm.reset();
  } catch (error) {
    console.log(error);
  }
}

// Handle party deletion
async function deleteParty(event) {
  if (event.target.classList.contains("delete-button")) {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
    const partyId = event.target.dataset.partyId;
    console.log(partyId);

    // Send a DELETE request to remove the party
    try {
      await fetch(`${API_URL}/${partyId}`, {
        method: "DELETE",
      });

      // Remove the deleted party from the party list
      event.target.parentElement.remove();
    } catch (error) {
      console.log(error);
    }
  }
}

// Render the party list
function renderPartyList() {
  state.parties.forEach((party) => {
    renderParty(party);
  });
}

// Render a party item
function renderParty(party) {
  const li = document.createElement("li");
  li.innerHTML = /* html */ `
        <strong>${party.name}</strong><br>
        Date: ${new Date(party.date).toLocaleDateString()}<br>
        Location: ${party.location}<br>
        Description: ${party.description}<br>
        <button class="delete-button" data-party-id="${
          party.id
        }">Delete</button>
      `;
  partyList.appendChild(li);
}