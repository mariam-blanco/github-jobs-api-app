/* eslint-disable no-unused-expressions */
let url = "";
let numPage = 1;
const MAX_CARDS_PAGE = 50;

const termsInputField = document.querySelector('.js-terms');
const divCardsList = document.querySelector(".js-cards-list");


// Change to "dark mode" or "light mode"
// -----------------------------------------------------------

const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');

const switchTheme = (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "ligth");
  }
};

toggleSwitch.addEventListener('change', switchTheme);


// Modal
// -----------------------------------------------------------

const modal = document.querySelector('.js-modal');
const btnOpenModal = document.querySelector('.js-btn-modal');

const showModal = (e) => {
  e.preventDefault();
  modal.classList.remove('hidden');
};

const hideModal = () => {
  modal.classList.add('hidden');
}

btnOpenModal.addEventListener('click', showModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideModal();
  }
});


// URL to fetch data 
// -----------------------------------------------------------

const setURL = (terms, location, isFullTime) => {
  const corsURL = "https://secure-crag-00895.herokuapp.com/";
  const baseURL = "https://jobs.github.com/positions.json";

  url = `${corsURL + baseURL}?page=${numPage}`;


  if (terms === undefined && location === undefined) {
    return url;
  }
  if (terms !== "") {
    url += `&description=${terms}`;
  }
  if (location !== "") {
    url += `&location=${location}`;
  }
  if (isFullTime) {
    url += "&full_time=on";
  }
  return url;

};


// Show error messages 
// -----------------------------------------------------------

const showMessage = (text) => {
  divCardsList.innerHTML = "";
  const paragraph = document.createElement("p");
  paragraph.classList.add("message");
  //const message = document.createTextNode(text);

  divCardsList.appendChild(paragraph);
  paragraph.innerHTML = text;
};

// Fetch jobs offers from API
// -----------------------------------------------------------

const getJobs = async (terms, location, isFullTime) => {
  let jobs = [];
  url = setURL(terms, location, isFullTime);
  //console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    jobs = await response.json();
    renderCards(jobs);
  } catch (error) {
    showMessage('Looks like there was a problem: ', error);
  }
};


// Create "Load more" button
// -----------------------------------------------------------

const showLoadMoreBtn = () => {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.className = "btn-primary js-loadMoreBtn";
  const textBtn = document.createTextNode("Load more");
  loadMoreBtn.appendChild(textBtn);
  loadMoreBtn.addEventListener("click", handleLoad);
  divCardsList.after(loadMoreBtn);
};


// Calculate time since date of publication of job offer
// -----------------------------------------------------------                    

const calculateTime = (dateCreated) => {
  const createdAtDate = new Date(dateCreated);
  const nowDate = new Date();
  const difference = nowDate - createdAtDate;

  const hours = Math.floor(difference / (1000 * 3600));
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(difference / (1000 * 3600 * 24));
  if (days < 7) {
    return `${days}d`;
  }
  const weeks = Math.floor(difference / (1000 * 3600 * 24 * 7));
  if (weeks < 4) {
    return `${weeks}w`;
  }
  const months = Math.floor(difference / (1000 * 3600 * 24 * 30));
  return `${months}m`;
};


// Render the list of job offers
// -----------------------------------------------------------

const renderCards = (jobs) => {
  if (numPage === 1) {
    divCardsList.innerHTML = '';
  }
  let htmlCards = "";
  jobs.forEach((job, index) => {
    const htmlCard = `
      <div class = "card js-card${index > MAX_CARDS_PAGE - 1 ? " hidden" : ""}">
        <div class="card-icon" style="background-image: url(${job.company_logo})"></div>
        <div class="card-content">
          <p class="text-secondary">${calculateTime(job.created_at)} ago · ${job.type}</p>
          <h3><a href=#>${job.title}</a></h3>
          <p class="text-secondary">${job.company}</p>
        </div>
        <h4 class="card-footer primary-color">${job.location}</h4>
      </div>
      `;
    htmlCards += htmlCard;
  });
  divCardsList.insertAdjacentHTML("beforeend", htmlCards);
  const loadMoreBtn = document.querySelector(".js-loadMoreBtn");

  if (jobs.length === MAX_CARDS_PAGE) {
    // eslint-disable-next-line no-plusplus
    numPage++;
    !loadMoreBtn && showLoadMoreBtn();
  } else if (jobs.length < MAX_CARDS_PAGE && !!loadMoreBtn) {
    loadMoreBtn.remove();
  }
};


// handleLoad()  
// -----------------------------------------------------------

const handleLoad = async () => {
  getJobs();
};

document.addEventListener("DOMContentLoaded", handleLoad);


// handleSearch()  
// -----------------------------------------------------------

const form = document.querySelector(".js-form");
const btnSmallSearch = document.querySelector('.js-small-search-btn');
const btnModalSearch = document.querySelector('.js-modal-search-btn');

const handleSearch = async (e) => {
  // eslint-disable-next-line no-unused-expressions
  e.preventDefault();

  let terms = '';
  let location = '';
  let isFullTime = '';
  numPage = 1;

  const locationModalInput = document.querySelector(".js-modal-location");
  const typeModalCheckbox = document.querySelector(".js-modal-fullTime");

  if (e.target === form) {

    terms = form.elements.terms.value;
    location = form.elements.location.value;
    isFullTime = form.elements.jobType.checked;

  } else if (e.target === btnSmallSearch) {

    terms = termsInputField.value;

  } else if (e.target === btnModalSearch) {

    hideModal();
    terms = termsInputField.value;
    location = locationModalInput.value;
    isFullTime = typeModalCheckbox.checked;

  }

  getJobs(terms, location, isFullTime);

  if (e.target === form) {

    form.elements.terms.value = '';
    form.elements.location.value = '';
    form.elements.jobType.checked = false;

  } else if (e.target === btnSmallSearch) {

    termsInputField.value = '';

  } else if (e.target === btnModalSearch) {

    termsInputField.value = '';
    locationModalInput.value = '';
    typeModalCheckbox.checked = false;

  }
};

form.addEventListener('submit', handleSearch);
btnModalSearch.addEventListener('click', handleSearch);
btnSmallSearch.addEventListener('click', handleSearch);


// changePlaceholderText()
// -----------------------------------------------------------

const mediaQuery = window.matchMedia('(max-width: 850px)');

const changePlaceholderText = (query) => {
  const typeLabel = document.querySelector('.js-label');

  if (query.matches) {
    termsInputField.placeholder = 'Filter by title...';
    typeLabel.innerHTML = 'Full Time';

  } else {
    termsInputField.placeholder = 'Filter by title, companies, expertise...';
    typeLabel.innerHTML = 'Full Time Only';
  }
}

changePlaceholderText(mediaQuery);
mediaQuery.addListener(changePlaceholderText);
