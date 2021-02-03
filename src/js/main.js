let jobs = [];
let url = '';
let numPage = 1;
const MAX_CARDS_PAGE = 50;


const form = document.querySelector('.js-form');
const divMain = document.querySelector('.js-main');

const divCardsList = document.querySelector('.js-cards-list');
const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');


const switchTheme = (e) =>{
  if(e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'ligth');
  }
} 

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
}

const getJobs = async (terms, location, isFullTime) => {
  
  url = setURL(terms, location, isFullTime);
  console.log(url);

  try {
    const response = await fetch(url);
    const jobs = await response.json();
    return jobs; 
  } catch (error) {
    showMessage('Lo sentimos, ha ocurrido un error en el servidor. Prueba más tarde');
  }  
};

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
  } else {
    const months = Math.floor(difference / (1000 * 3600 * 24 * 30));
    return `${months}m`;
  }  
}

const showLoadMoreBtn = () => {
  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.className = 'btn-primary js-loadMoreBtn';
  const textBtn = document.createTextNode('Load more');
  loadMoreBtn.appendChild(textBtn);
  //loadMoreBtn.addEventListener('click', loadMoreCards);
  loadMoreBtn.addEventListener('click', handleLoad);
  divCardsList.after(loadMoreBtn);  
}
 /*
const loadMoreCards = () => {
  
  jobs = await getJobs();
  renderCards();

 
  const hiddenCards = document.querySelectorAll('.hidden');
  
  hiddenCards.forEach((card, index) => {
    if (index < maxCards) {
      card.classList.remove('hidden');
    }  
  })
   
}
*/ 
const renderCards = () => {  
  let htmlCards = '';
  jobs.forEach((job, index) => {
   
    let  htmlCard = 
      `
      <div class = "card js-card${(index > MAX_CARDS_PAGE - 1) ? ' hidden' : ''}">
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
  divCardsList.insertAdjacentHTML('beforeend', htmlCards);
  
  
  
  const loadMoreBtn = document.querySelector('.js-loadMoreBtn');
  if (jobs.length === MAX_CARDS_PAGE) {
    numPage++;
    !loadMoreBtn && showLoadMoreBtn();
  } else if (jobs.length < MAX_CARDS_PAGE && !!loadMoreBtn) {
    loadMoreBtn.remove();
  }
  
  //jobs.length === maxCards && showLoadMoreBtn() && numPage++; 
};


const setURL = (terms, location, isFullTime) => {
  
  const corsURL = 'https://cors-anywhere.herokuapp.com/';
  const baseURL = 'https://jobs.github.com/positions.json?';
  
  url = corsURL + baseURL + 'page=' + numPage;
  
  if(terms === undefined && location === undefined) {
    return url;
  } else {
    if(terms !== '') {
      url += '&description=' + terms;
    }
    if (location !== '') {
      url += '&location=' + location;
    }
    if(isFullTime) {
      url += '&full_time=on';
    }
    return url;
  } 
}

const showMessage = (text) => {
  divCardsList.innerHTML = '';
  const paragraph = document.createElement('p');
  const message = document.createTextNode(text);
  paragraph.classList.add('message');
  divCardsList.appendChild(paragraph);
  paragraph.appendChild(message);  
};

document.addEventListener('DOMContentLoaded', handleLoad); 
form.addEventListener('submit', handleSearch);
toggleSwitch.addEventListener('change', switchTheme);

