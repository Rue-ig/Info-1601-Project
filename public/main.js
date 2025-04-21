//Did You Know? Section
// Array of facts about Caribbean wildlife
const facts = [
  "The Caribbean is home to over 700 species of birds, including the endangered Roseate Spoonbill and the majestic Frigatebird.",
  "Many Caribbean islands have unique ecosystems, with species that can only be found in those specific locations.",
  "Coral reefs in the Caribbean are some of the most diverse and vibrant in the world.",
  "Some Caribbean islands are home to endemic species, meaning they are found nowhere else on Earth.",
  "The Caribbean Sea is one of the largest saltwater seas and supports millions of marine creatures."
];

let currentFact = 0;

function showNextFact() {
  currentFact = (currentFact + 1) % facts.length;
  document.getElementById("fact").textContent = facts[currentFact];
}

//Functionality for Filter by Animal Type Function
let allAnimals = []; // to store all fetched records

function populateFilterTypes(records) {
  const filterSelect = document.getElementById('type-filter');
  const types = [...new Set(records.map(r => r.type).filter(Boolean))];

  types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      filterSelect.appendChild(option);
  });
}

//Functionality for Filter by Country Function
function populateCountryFilter(records) {
  const filterSelect = document.getElementById('country-filter');
  const countryKeys = getCountryKeys(records);

  countryKeys.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      filterSelect.appendChild(option);
  });
}
function getCountryKeys(records) {
  const countryKeys = new Set();
  records.forEach(rec => {
      for (let key in rec) {
          if (["yes", "no"].includes(rec[key]) && key.length <= 5) {
              countryKeys.add(key);
          }
      }
  });
  return Array.from(countryKeys);
}

//Get Data from API
async function getData() {
  const url = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh-vRW6fxasGQMdqJGzo9NFWjegB-FMraDNUMUSFlRLaSMz_33hK6kiRY-0C0xNgob6w307ciFCz-bOWPZfovIwM-ky7y89iEFlB1FSuvjtmXXJx-rhgL9yHD6_c2LEUZ77VCKMJYTHdBkk85ThzbfoPeqTQSdmsmsodf9jWEdgmyPKrBqMU9cY9dyA0Fo1_3ogr-ZM7zgujNJ0A7Z6jswCyT-0BNi8zsPfOVwVnd06391J7qxG5icZjR90PhDxMDBebEXdCml7CfFCBKCz9XoLpPds6Zl12hdEcYJgavBVSw9jY5O0A5qGd_pilJSLzs01NBVZ&lib=MWE_QBjJXwXXD4bogbvGarrsOYE1fA0Zf';

  try {
      const response = await fetch(url);
      const data = await response.json();
      const records = data.records || data.data || [];

      allAnimals = records;
      populateFilterTypes(records);
      populateCountryFilter(records);
      renderFilteredGallery();


  } catch (error) {
      console.error('Failed to load data:', error);
      document.getElementById('gallery').textContent = 'Failed to load data.';
  }
}

function getCountriesFound(rec) {
  const countryMap = {
      "SVG": "Saint Vincent and the Grenadines",
      "DOM": "Dominica",
      "T&T": "Trinidad and Tobago",
      "JAM": "Jamaica",
      "GUY": "Guyana"
  };

  const foundIn = Object.keys(countryMap).filter(code => rec[code] === "yes");

  const fullNames = foundIn.map(code => countryMap[code]);

  return fullNames.length
      ? `<p><strong>Found in:</strong></p> ${fullNames.join(", ")}`
      : "Not found in listed countries";
}



//Render Filtered Gallery
function renderFilteredGallery() {
  const typeValue = document.getElementById('type-filter').value;
  const countryValue = document.getElementById('country-filter').value;

  const filtered = allAnimals.filter(rec => {
      const typeMatch = typeValue === 'all' || rec.type === typeValue;
      const countryMatch = countryValue === 'all' || rec[countryValue] === "yes";
      return typeMatch && countryMatch;
  });

  const gallery = document.getElementById('gallery');
  const loadingMessage = document.getElementById('loading-message');
  let html = '';

  filtered.forEach((rec, index) => {
    html += `
      <div class="card" style="--delay: ${index * 0.1}s; text-align: left;">
        <img src="${rec.Image}" alt="${rec["Common Name"] || 'Wildlife'}">
        <h3>${rec["Common Name"]}</h3>
        <p><strong>Scientific Name:</strong> ${rec["Scientific Name"]}</p>
        <p><strong>Local Name:</strong> ${rec["Local Name"]}</p>
        <p><strong>Description:</strong> ${rec["Description"]}</p>
        <p><strong>Type:</strong> ${rec["type"]}</p>
        <p>${getCountriesFound(rec)}</p>
        <button class="fav-btn" onclick="addToFavourites(${JSON.stringify(rec).replace(/"/g, '&quot;')})">⭐ Favorite</button>
      </div>
    `;
  });
  

  gallery.innerHTML = html;

  // Hide the loading message once the cards are loaded
  if (loadingMessage) {
      loadingMessage.style.display = 'none';
  }
}


//Functionality for Favourites Button
function addToFavourites(animal) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert('You must be signed in to add favourites.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  const userFavourites = users[currentUser]?.favourites || [];

  // Avoid duplicates
  if (!userFavourites.some(fav => fav["Common Name"] === animal["Common Name"])) {
    if (!users[currentUser]) users[currentUser] = {};
    users[currentUser].favourites = [...userFavourites, animal];
    localStorage.setItem('users', JSON.stringify(users));

    // Show custom notification
    showNotification(`${animal["Common Name"]} added to favourites! Go to the Favourites page to view your saved animals.`);
  } else {
    alert(`${animal["Common Name"]} is already in your favourites.`);
  }
}

function removeFromFavourites(commonName) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert('You must be signed in to remove favourites.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || {};
  const favourites = users[currentUser]?.favourites || [];

  // Filter out the item to be removed
  users[currentUser].favourites = favourites.filter(item => item["Common Name"] !== commonName);
  localStorage.setItem('users', JSON.stringify(users));

  // Refresh the favourites list
  loadFavourites();

  // Show custom notification
  showNotification(`${commonName} has been removed from your favourites.`);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = 'notification';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000); // Remove the notification after 5 seconds
}

getData();
// Event listeners for filters
document.getElementById('type-filter').addEventListener('change', renderFilteredGallery);
document.getElementById('country-filter').addEventListener('change', renderFilteredGallery);

// Slideshow functionality
const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh-vRW6fxasGQMdqJGzo9NFWjegB-FMraDNUMUSFlRLaSMz_33hK6kiRY-0C0xNgob6w307ciFCz-bOWPZfovIwM-ky7y89iEFlB1FSuvjtmXXJx-rhgL9yHD6_c2LEUZ77VCKMJYTHdBkk85ThzbfoPeqTQSdmsmsodf9jWEdgmyPKrBqMU9cY9dyA0Fo1_3ogr-ZM7zgujNJ0A7Z6jswCyT-0BNi8zsPfOVwVnd06391J7qxG5icZjR90PhDxMDBebEXdCml7CfFCBKCz9XoLpPds6Zl12hdEcYJgavBVSw9jY5O0A5qGd_pilJSLzs01NBVZ&lib=MWE_QBjJXwXXD4bogbvGarrsOYE1fA0Zf';

let slideIndex = 1;

async function loadSlideshow() {
  const loadingMessage = document.getElementById("slideshow-loading-message");
  const slideshow = document.getElementById("slideshow-container");
  const dots = document.getElementById("dot-container");

  // Show the loading message
  if (loadingMessage) {
    loadingMessage.style.display = "block";
  }

  try {
    // Simulate fetching slideshow data (replace with actual API call if needed)
    const res = await fetch(apiUrl); // Replace `apiUrl` with your actual API endpoint
    const data = await res.json();
    const records = data.records || data.data || [];

    // Clear existing slideshow content
    slideshow.innerHTML = '';
    dots.innerHTML = '';

    // Populate slideshow with new content
    records.forEach((rec, i) => {
      slideshow.innerHTML += `
        <div class="mySlides fade">
          <img src="${rec.Image}" alt="${rec["Common Name"]}">
          <div class="slide-text-overlay">
            <h3>Can You Guess?</h3>
            <p>${rec["Description"]}</p>
          </div>
        </div>
      `;

      dots.innerHTML += `<span class="dot" onclick="currentSlide(${i + 1})"></span>`;
    });

    // Initialize slideshow
    showSlides(1); // Assuming you have a `showSlides` function
  } catch (err) {
    console.error('Failed to load slideshow data:', err);
    slideshow.innerHTML = '<p style="text-align: center; color: red;">Failed to load slideshow data.</p>';
  } finally {
    // Hide the loading message once the slideshow is ready
    if (loadingMessage) {
      loadingMessage.style.display = "none";
    }
  }
}

function plusSlides(n) {
showSlides(slideIndex += n);
}

function currentSlide(n) {
showSlides(slideIndex = n);
}

function showSlides(n) {
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  if (dots.length > 0) {
    dots[slideIndex - 1].className += " active";
  }
}

loadSlideshow();

// Set interval for automatic slideshow
let slideInterval = setInterval(() => plusSlides(1), 5000); // Change image every 5 seconds
