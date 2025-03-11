const partyList = document.getElementById('party-list');
const addPartyForm = document.getElementById('add-party-form');
let parties = [];

//I can't get the API to jive
const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2502-FTB-ET-WEB-FT/events';


async function fetchParties() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    parties = await response.json();
    renderParties();
  } catch (error) {
    console.error('Error fetching parties:', error);
    partyList.innerHTML = '<p>Error loading parties.</p>';
  }
}

function renderParties() {
  partyList.innerHTML = '';
  parties.forEach(party => {
    const partyItem = document.createElement('div');
    partyItem.classList.add('party-item');
    partyItem.innerHTML = `
      <div>
        <strong>${party.name}</strong><br>
        Date: ${party.date}<br>
        Time: ${party.time}<br>
        Location: ${party.location}<br>
        Description: ${party.description}
      </div>
      <button data-id="${party.id}">Delete</button>
    `;
    partyList.appendChild(partyItem);
  });
}

async function addParty(event) {
  event.preventDefault();
  const formData = new FormData(addPartyForm);
  const party = {
    name: formData.get('name'),
    date: formData.get('date'),
    time: formData.get('time'),
    location: formData.get('location'),
    description: formData.get('description')
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(party)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    fetchParties();
    addPartyForm.reset();
  } catch (error) {
    console.error('Error adding party:', error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    fetchParties();
  } catch (error) {
    console.error('Error deleting party:', error);
  }
}

addPartyForm.addEventListener('submit', addParty);

partyList.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const id = event.target.dataset.id;
    deleteParty(id);
  }
});

fetchParties();