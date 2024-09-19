'use strict';

import {API} from "./api.js";
import {skeletonTemplate, createCard} from "./global.js";


const form = document.querySelector("[data-form]");
const search_input = document.querySelector("[data-form-input]");

form.addEventListener('submit', event =>{
    event.preventDefault();
    if(search_input.value){
        window.location = `/recipes.html?q=${search_input.value}`;
    }
});


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



function renderCards(selectedButton, selectedPanel){

    selectedPanel.innerHTML =
    `<div class="card-list">
        ${skeletonTemplate.repeat(12)}
    </div>`;

    const mealType = selectedButton.textContent.trim().toLowerCase();

    API.fetch([["mealType", mealType], ...API.default_queries], data =>{
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
    API.fetch([["cuisineType", cuisines[index]], ...API.default_queries], data =>{
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

