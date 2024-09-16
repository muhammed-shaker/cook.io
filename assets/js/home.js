'use strict';

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

    selectedPanel.innerHTML =
    `<div class="card-list">
        ${skeletonTemplate.repeat(12)}
    </div>`;

    const mealType = selectedButton.textContent.trim().toLowerCase();

    API.fetch([["mealType", mealType], ...API.card_queries], data =>{
        selectedPanel.innerHTML = "";
        const cardList = document.createElement('div');
        cardList.classList.add('card-list');

        for(let i = 0; i < 12 ; i++){

            const {image, label, totalTime, uri} = data.hits[i].recipe;

            const cardElement = createCard(label, image, totalTime, uri);
            cardList.appendChild(cardElement);
        }

        selectedPanel.appendChild(cardList);
        selectedPanel.innerHTML +=
        `<a class="btn btn-secondary show-more-btn has-state label-large" href="./recipes?mealTyep=${mealType}">
            Show More
        </a>`;
    });
    
};


const sliderSections = document.querySelectorAll('[data-slider-section]');
const cuisines = ["Asian", "French"];
sliderSections.forEach((section, index) =>{  
    section.innerHTML =
    `<div class="container">
        <h2 class="section-title headline-small">Latest ${cuisines[index]} Recipes</h2>
        <div class="slider">
            <ul class="slider-items">
                ${(`<li class="slider-item">${skeletonTemplate}</li>`).repeat(10)}
            </ul>
        </div>
    </div>`;
});

renderCards(lastActiveTabButton, lastActiveTabPanel);


sliderSections.forEach((section, index) =>{  
    API.fetch([["cuisineType", cuisines[index]], ...API.card_queries], data =>{
        section.innerHTML =
        `<div class="container">
            <h2 class="section-title headline-small">Latest ${cuisines[index]} Recipes</h2>
            <div class="slider">
                <ul class="slider-items" data-slider-item></ul>
            </div>
        </div>`;

        const slider_items = section.querySelector("[data-slider-item]");
        
        for(let i = 0; i < 10; i++){
            const slider_item = document.createElement("li");
            slider_item.classList.add("slider-item");
            
            const {image, label, totalTime, uri} = data.hits[i].recipe;

            const cardElement = createCard(label, image, totalTime, uri);
            slider_item.appendChild(cardElement);
            slider_items.appendChild(slider_item);
        }

        slider_items.innerHTML += 
        `<li class="slider-item">
            <a href="./recipes.html" class="load-more-card has-state">
                <span class="label-large">Show more</span>
                <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
            </a>
        </li>`;
    });
});



/**
 * 
 * @param {string} label - title of the recipe
 * @param {string} image - image of the recipe
 * @param {object} time  - object with 2 porperties, duration and the unit
 * @param {string} uri   - uri of the recipe 
 * @param {number} type - defines the type of the return (0: HTML string or 1: nodeElement)
 */
function createCard(label, image, cookingTime, uri){

    const recipe_id = uri.slice(uri.lastIndexOf("_") + 1, -1);

    // Check if the recipe is saved
    let is_saved = false;
    if(window.localStorage.getItem("cook.io-" + recipe_id)){
        is_saved = true;
    }

    const time = getTime(cookingTime);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = 
    `<figure class="image-loader">
        <img class="card-thumble" src="${image}" alt="${label}" loading="lazy" width="195" height="195">
    </figure>
    <h3 class="title-small">
        <a href="/recipes.html" class="card-link">${label ?? "Untiteled"}</a>
    </h3>
    <div class="meta-items">
        <span class="meta-duration">
            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
            <span class="label-medium"> ${time.duration|| "<1"} ${time.unit}</span>
        </span>
        <button class="icon-btn has-state ${is_saved ? 'saved' : 'unsaved'}" onclick="saveRecipe('${recipe_id}', element = this)">
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
        </button>
    </div>`;

    return card;
}

function saveRecipe(recipeid, element){   
    if(window.localStorage.getItem("cook.io-" + recipeid)){
        window.localStorage.removeItem("cook.io-" + recipeid);
        element.classList.remove("saved");
        element.classList.add("unsaved");
    } else{
        window.localStorage.setItem(("cook.io-" + recipeid), "saved");
        element.classList.remove("unsaved");
        element.classList.add("saved");
    }
}

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