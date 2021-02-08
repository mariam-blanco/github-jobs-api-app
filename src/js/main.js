/* eslint-disable no-unused-expressions */
let jobs = [];
let url = "";
let numPage = 1;
const MAX_CARDS_PAGE = 50;

const form = document.querySelector(".js-form");
const termsInputField = document.querySelector('.js-terms');
const divCardsList = document.querySelector(".js-cards-list");
const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');

const modal = document.querySelector('.js-modal');
const btnOpenModal = document.querySelector('.js-btn-modal');
const btnModalSearch = document.querySelector('.js-modal-submit-btn');

/*
* Change to "dark mode" or "light mode"
* -----------------------------------------------------------
*/

const switchTheme = (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "ligth");
  }
};

const showModal = (e) => {
  e.preventDefault();
  modal.classList.remove('hidden');
};

const hideModal = () => {
  modal.classList.add('hidden');
}

/*
* URL to fetch data 
* -----------------------------------------------------------
*/

const setURL = (terms, location, isFullTime) => {
  const corsURL = "https://cors-anywhere.herokuapp.com/";
  const baseURL = "https://jobs.github.com/positions.json?";

  url = `${corsURL + baseURL}page=${numPage}`;

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

/*
* Show error messages 
* -----------------------------------------------------------
*/

const showMessage = (text) => {
  divCardsList.innerHTML = "";
  const paragraph = document.createElement("p");
  const message = document.createTextNode(text);
  paragraph.classList.add("message");
  divCardsList.appendChild(paragraph);
  paragraph.appendChild(message);
};

/*
* Fetch jobs offers from API
* -----------------------------------------------------------
*/

const getJobs = async (terms, location, isFullTime) => {
  url = setURL(terms, location, isFullTime);

  try {
    const response = await fetch(url);
    jobs = await response.json();
    return jobs;
  } catch (error) {
    showMessage(
      "Lo sentimos, ha ocurrido un error en el servidor. Prueba más tarde"
    );
  }
};

/*
* Create "Load more" button
* -----------------------------------------------------------
*/

const showLoadMoreBtn = () => {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.className = "btn-primary js-loadMoreBtn";
  const textBtn = document.createTextNode("Load more");
  loadMoreBtn.appendChild(textBtn);
  // loadMoreBtn.addEventListener('click', loadMoreCards);
  loadMoreBtn.addEventListener("click", handleLoad);
  divCardsList.after(loadMoreBtn);
};

/*
* Calculate time since date of publication of job offer
* -----------------------------------------------------------                    
*/

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

/*
* Render the list of job offers
* -----------------------------------------------------------
*/

const renderCards = () => {
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

/*
* handleSearch()  
* -----------------------------------------------------------
*/

const handleLoad = async () => {
  jobs = await getJobs();
  renderCards();
};

const handleSearch = async (e) => {
  // eslint-disable-next-line no-unused-expressions
  e.preventDefault();

  const terms = form.elements.terms.value;
  const location = form.elements.location.value;
  const isFullTime = form.elements.jobType.checked;

  jobs = await getJobs(terms, location, isFullTime);
  renderCards();
};

const handleModalSearch = async (e) => {
  // eslint-disable-next-line no-unused-expressions
  e.preventDefault();
  hideModal();

  const locationModalInput = document.querySelector(".js-modal-location");
  const typeModalCheckbox = document.querySelector(".js-modal-fullTime");

  const terms = termsInputField.value;
  const location = locationModalInput.value;
  const isFullTime = typeModalCheckbox.checked;

  jobs = await getJobs(terms, location, isFullTime);
  renderCards();
};

/*
* changePlaceholderText() y changeSearchBox() 
* -----------------------------------------------------------
*/

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

btnOpenModal.addEventListener('click', showModal);
document.addEventListener("DOMContentLoaded", handleLoad);
form.addEventListener('submit', handleSearch);
toggleSwitch.addEventListener('change', switchTheme);
btnModalSearch.addEventListener('click', handleModalSearch);
