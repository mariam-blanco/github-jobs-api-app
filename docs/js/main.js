let jobs=[],url="",numPage=1;const MAX_CARDS_PAGE=50,form=document.querySelector(".js-form"),divMain=document.querySelector(".js-main"),divCardsList=document.querySelector(".js-cards-list"),toggleSwitch=document.querySelector('.switch input[type="checkbox"]'),switchTheme=e=>{e.target.checked?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","ligth")},handleSearch=async e=>{e.preventDefault();const t=form.elements.terms.value,o=form.elements.location.value,a=form.elements.jobType.checked;numPage=1,jobs=await getJobs(t,o,a),renderCards()},handleLoad=async()=>{jobs=await getJobs(),renderCards()},getJobs=async(e,t,o)=>{url=setURL(e,t,o),console.log(url);try{const e=await fetch(url);return await e.json()}catch(e){showMessage("Lo sentimos, ha ocurrido un error en el servidor. Prueba más tarde")}},calculateTime=e=>{const t=new Date(e),o=new Date-t,a=Math.floor(o/36e5);if(a<24)return`${a}h`;const n=Math.floor(o/864e5);if(n<7)return`${n}d`;const r=Math.floor(o/6048e5);if(r<4)return`${r}w`;return`${Math.floor(o/2592e6)}m`},showLoadMoreBtn=()=>{const e=document.createElement("button");e.className="btn-primary js-loadMoreBtn";const t=document.createTextNode("Load more");e.appendChild(t),e.addEventListener("click",handleLoad),divCardsList.after(e)},renderCards=()=>{let e="";jobs.forEach(((t,o)=>{let a=`\n      <div class = "card js-card${o>49?" hidden":""}">\n        <div class="card-icon" style="background-image: url(${t.company_logo})"></div>\n        <div class="card-content">\n          <p class="text-secondary">${calculateTime(t.created_at)} ago · ${t.type}</p>\n          <h3><a href=#>${t.title}</a></h3>\n          <p class="text-secondary">${t.company}</p>\n        </div>\n        <h4 class="card-footer primary-color">${t.location}</h4>\n      </div>\n      `;e+=a})),divCardsList.insertAdjacentHTML("beforeend",e);const t=document.querySelector(".js-loadMoreBtn");50===jobs.length?(numPage++,!t&&showLoadMoreBtn()):jobs.length<50&&t&&t.remove()},setURL=(e,t,o)=>(url="https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?page="+numPage,void 0===e&&void 0===t||(""!==e&&(url+="&description="+e),""!==t&&(url+="&location="+t),o&&(url+="&full_time=on")),url),showMessage=e=>{divCardsList.innerHTML="";const t=document.createElement("p"),o=document.createTextNode(e);t.classList.add("message"),divCardsList.appendChild(t),t.appendChild(o)};document.addEventListener("DOMContentLoaded",handleLoad),form.addEventListener("submit",handleSearch),toggleSwitch.addEventListener("change",switchTheme);