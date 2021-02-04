/* eslint-disable no-unused-expressions */
let jobs = [];
let url = "";
let numPage = 1;
const MAX_CARDS_PAGE = 50;

const form = document.querySelector(".js-form");
const divCardsList = document.querySelector(".js-cards-list");
const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');

const switchTheme = (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "ligth");
  }
};

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

const showMessage = (text) => {
  divCardsList.innerHTML = "";
  const paragraph = document.createElement("p");
  const message = document.createTextNode(text);
  paragraph.classList.add("message");
  divCardsList.appendChild(paragraph);
  paragraph.appendChild(message);
};

const showLoadMoreBtn = () => {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.className = "btn-primary js-loadMoreBtn";
  const textBtn = document.createTextNode("Load more");
  loadMoreBtn.appendChild(textBtn);
  // loadMoreBtn.addEventListener('click', loadMoreCards);
  loadMoreBtn.addEventListener("click", handleLoad);
  divCardsList.after(loadMoreBtn);
};

const getJobs = async (terms, location, isFullTime) => {
  url = setURL(terms, location, isFullTime);
  console.log(url);
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
* renderCards() --> xxx 
* -----------------------------------------------------------
* 
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
* handleSearch() --> xxx 
* handleLoad()   -->  xxx
* -----------------------------------------------------------
*/

const handleSearch = async (event) => {
  // eslint-disable-next-line no-unused-expressions
  event.preventDefault();
  const terms = form.elements.terms.value;
  const location = form.elements.location.value;
  const isFullTime = form.elements.jobType.checked;
  numPage = 1;

  jobs = await getJobs(terms, location, isFullTime);
  renderCards();
};

const handleLoad = async () => {
  jobs = await getJobs();
  renderCards();
};

/*
* calculateTime() --> 
* -----------------------------------------------------------
* Calcula el tiempo transcurrido desde que se publicó la oferta
* de trabajo.                     
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
* changePlaceholderText() y changeSearchBox() 
* -----------------------------------------------------------
*/

const mediaQuery = window.matchMedia('(max-width: 850px)');

const termsInputField = document.querySelector('.js-terms');

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

const mediaQueryMobile = window.matchMedia('(max-width: 640px)');
const changeSearchBox = (query) => {
  const submitBtn = document.querySelector('.js-submit-btn');

  if (query.matches) {
    submitBtn.innerHTML =
      `
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.112 15.059h-1.088l-.377-.377a8.814 8.814 0 002.15-5.784A8.898 8.898 0 008.898 0 8.898 8.898 0 000 8.898a8.898 8.898 0 008.898 8.899c2.211 0 4.23-.808 5.784-2.143l.377.377v1.081l6.845 6.832 2.04-2.04-6.832-6.845zm-8.214 0A6.16 6.16 0 118.9 2.737a6.16 6.16 0 010 12.322z" fill="#fff" fill-rule="nonzero"/>
      </svg>
      `;

  } else {
    submitBtn.innerHTML = 'Search';
  }
}
changePlaceholderText(mediaQuery);
mediaQuery.addListener(changePlaceholderText);

changeSearchBox(mediaQueryMobile);
mediaQueryMobile.addListener(changeSearchBox);

//const loadMoreCards = () => {
//  jobs = await getJobs();
//  renderCards();
//  const hiddenCards = document.querySelectorAll('.hidden');
//  hiddenCards.forEach((card, index) => {
//    if (index < maxCards) {
//      card.classList.remove('hidden');
//    }
//  })
//}

document.addEventListener("DOMContentLoaded", handleLoad);
form.addEventListener("submit", handleSearch);
toggleSwitch.addEventListener("change", switchTheme);
