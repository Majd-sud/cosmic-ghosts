// API Key from NASA's public demo
const apiKey = 'DEMO_KEY';

// DOM Elements
const dateInput = document.getElementById('date');
const form = document.getElementById('apodForm');
const output = document.getElementById('output');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');

// Set today's date as the maximum date user can select
const today = new Date().toISOString().split("T")[0];
dateInput.max = today;

/**
 * Fetch data from NASA APOD API for a given date (AJAX call)
 */
function fetchAPOD(date) {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    .then(response => response.json())
    .then(data => displayAPOD(data)) // Handle successful data
    .catch(error => {
      // Show user-friendly error
      output.innerHTML = `<p class="error">Error fetching data: ${error.message}</p>`;
    });
}

/**
 * Display the APOD content on the page (dynamic DOM update)
 */
function displayAPOD(data) {
  output.innerHTML = `
    <h2>${data.title}</h2>
    <p><strong>Date:</strong> ${data.date}</p>
    ${data.media_type === "image"
      ? `<img src="${data.url}" alt="APOD Image">`
      : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`}
    <p>${data.explanation}</p>
    ${data.hdurl || data.media_type === "image"
      ? `<div class="action-buttons">
          ${data.hdurl ? `<a href="${data.hdurl}" target="_blank">View in Full HD</a>` : ""}
        </div>` : ""}
  `;
}

// Event #1: Submit form to fetch image of the selected date
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = dateInput.value;
  if (date) {
    fetchAPOD(date); // Valid: Fetch and show image
  } else {
    output.innerHTML = `<p class="error">Please select a valid date.</p>`; // Invalid: Show message
  }
});

// Event #2: Generate a random date (between 1996 and today) and fetch image
randomBtn.addEventListener('click', () => {
  const start = new Date(1996, 5, 16);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const formattedDate = randomDate.toISOString().split('T')[0];
  dateInput.value = formattedDate;
  fetchAPOD(formattedDate);
});

// Event #3: Clear the current result and input
clearBtn.addEventListener('click', () => {
  output.innerHTML = '';
  dateInput.value = '';
});
