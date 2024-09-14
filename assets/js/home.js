const form = document.querySelector("[data-form]");
const search_input = document.querySelector("[data-form-input]");

form.addEventListener('submit', event =>{
    event.preventDefault();
    if(search_input.value){
        window.location = `/recipes.html?q=${search_input.value}`;
    }
});


// Tab Panel

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels  = document.querySelectorAll(".tab-panel");

let [lastActiveTabButton] = tabButtons;
let [lastActiveTabPanel] = tabPanels;


tabButtons.forEach(button => {
    button.addEventListener('click', () =>{
        lastActiveTabButton.setAttribute("aria-selected", false);
        button.setAttribute("aria-selected", true);

        lastActiveTabPanel.setAttribute("hidden", "true");
        const selectedTabPanel = document.getElementById(
            button.getAttribute('aria-controls')
        );
        
        selectedTabPanel.removeAttribute("hidden");

        lastActiveTabButton = button; // this       
        lastActiveTabPanel = selectedTabPanel;
        renderCards(button, lastActiveTabPanel);
    });
});


// Fetch Data 


const API = {
    accessPoint: "https://api.edamam.com/api/recipes/v2",
    applicationId: "28de1a66",
    key: "85d45c4eb4003d8f3ae4c23e42a2d87a",
    type: "public",
    fetch: async function(queries, callback){
        const query = queries?.join("&")
        .replace(/,/g, "=")
        .replace(/ /g, "%20")
        .replace(/\+/g, "%2B");
    
        const requestUrl = `${API.accessPoint}?app_id=${API.applicationId}&app_key=${API.key}&type=${API.type}${query ? ("&" + query) :""}`;
        
        
        const response = await fetch(requestUrl);
        
        if(response.ok){
            const data = await response.json();
            callback(data);
        }
    },
    card_queries: [
        ["field", "uri"],
        ["field", "label"],
        ["field", "image"],
        ["field", "totalTime"]
    ],
}

const skeletonTemplate = `
<div class="skeleton-card">
    <div class="skeleton skeleton-card-thumble"></div>
    <div class="skeleton-body">
        <div class="skeleton skeleton-card-title"></div>
        <div class="skeleton skeleton-card-text"></div>
    </div>
</div>`;




function renderCards(selectedButton, selectedPanel){

    selectedPanel.innerHTML = `
        <div class="card-list">
            ${skeletonTemplate.repeat(12)}
        </div>
    `;
    const mealType = selectedButton.textContent.trim().toLowerCase();

    API.fetch([["mealType", mealType], ...API.card_queries], data =>{
        selectedPanel.innerHTML = "";
        const cardList = document.createElement('div');
        cardList.classList.add('card-list');

        for(let i = 0; i < 12 ; i++){
            const {recipe} = {
                image,
                label: title,
                totalTime: cookingTime,
                uri,
            } = data.hits[i];

            const time = getTime(recipe.totalTime);

            cardList.innerHTML += `
            <div class="card">
                <figure class="image-loader">
                    <img class="card-thumble" src="${recipe.image}" alt="${recipe.label}" loading="lazy" width="195" height="195">
                </figure>
                <h3 class="title-small">
                    <a href="/recipes.html" class="card-link">${recipe.label ?? "Untiteled"}</a>
                </h3>
                <div class="meta-items">
                    <span class="meta-duration">
                        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                        <span class="label-medium"> ${time.duration|| "<1"} ${time.unit}</span>
                    </span>
                    <button class="icon-btn has-state unsaved">
                        <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                        <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                    </button>
                </div>
            </div>`;
        }
        selectedPanel.appendChild(cardList);
        selectedPanel.innerHTML += `
            <a class="btn btn-secondary show-more-btn has-state label-large" href="/recipes.html?mealTyep=${mealType}">Show More</a>
        `;
    });
    
};

function getTime(minutes){
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(minutes / 24);

    const time = days || hours || minutes;
    const unitIndex = [minutes, hours, days].indexOf(time);
    let unit = ["minutes", "hours", "days"][unitIndex];
    if(time <= 1){
        unit = unit.slice(0, -1) // removing the plural s
    }
    
    return {duration: time, unit};
}

const sliderSections = document.querySelectorAll('[data-slider-section]');
const cuisines = ["Asian", "French"];
sliderSections.forEach((section, index) =>{  

    section.innerHTML = `
    <div class="container">
        <h2 class="section-title headline-small">Latest ${cuisines[index]} Recipes</h2>
        <div class="slider">
            <ul class="slider-items">
                ${(`<li class="slider-item">${skeletonTemplate}</li>`).repeat(10)}
            </ul>
        </div>
    </div>
    `;
});

renderCards(lastActiveTabButton, lastActiveTabPanel);


sliderSections.forEach((section, index) =>{  
    API.fetch([["cuisineType", cuisines[index]], ...API.card_queries], data =>{
        const recipes = data.hits.map(hit =>{
            const recipe = hit.recipe;
            const time = getTime(recipe.totalTime);
            return `<li class="slider-item">
                    <div class="card">
                        <figure class="image-loader">
                            <img class="card-thumble" src="${recipe.image}" alt="${recipe.label}" loading="lazy" width="195" height="195">
                        </figure>
                        <h3 class="title-small">
                            <a href="/recipes.html" class="card-link">${recipe.label ?? "Untiteled"}</a>
                        </h3>
                        <div class="meta-items">
                            <span class="meta-duration">
                                <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                                <span class="label-medium"> ${time.duration|| "<1"} ${time.unit}</span>
                            </span>
                            <button class="icon-btn has-state unsaved">
                                <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                                <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                            </button>
                        </div>
                    </div>
                </li>`;
            
        });
        section.innerHTML = `
        <div class="container">
            <h2 class="section-title headline-small">Latest ${cuisines[index]} Recipes</h2>
            <div class="slider">
                <ul class="slider-items">
                    ${recipes.join("")}
                    <li class="slider-item">
                        <a href="recipes.html" class="load-more-card has-state">
                        <span class="label-large">Show more</span>
        
                        <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>`;
    });
});









