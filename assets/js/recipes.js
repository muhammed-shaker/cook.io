"use strict";

import {API} from "./api.js";
import {createCard, skeletonTemplate} from "./global.js";

const accordionTogglers = document.querySelectorAll("[data-accordion-btn]");
accordionTogglers.forEach(toggler =>{
    toggler.addEventListener("click", () =>{
        const is_expanded = toggler.getAttribute("aria-expanded");
        
        toggler.setAttribute("aria-expanded", is_expanded === "false" ? "true" : "false");
    });
});

const filter = document.querySelector("[data-filter-bar]");
const overlay = document.querySelector("[data-overlay]");
const filterTogglers = document.querySelectorAll("[data-filter-toggler]");

filterTogglers.forEach(toggler =>{
    toggler.addEventListener("click", () =>{
        filter.classList.toggle("active");
        overlay.classList.toggle("active");
    });
});

const submitButton = document.querySelector("[data-filter-submit]");
const clearButton = document.querySelector("[data-filter-clear]");

const search_input = document.querySelector("[data-filter-search]");

submitButton.addEventListener("click", () =>{
    const checkboxes = document.querySelectorAll(".checkbox:checked");
    const queries = [];
    if(search_input.value) queries.push(["q", search_input.value]);
    checkboxes.forEach(checkbox =>{
        const key = checkbox.parentElement.parentElement.dataset.filter;
        queries.push([key, checkbox.value]);
    });

    window.location =  queries.length ? ("/recipes.html?" + queries.join("&").replace(/,/g, "=")) : "/recipes.html";
});

search_input.addEventListener("keydown", event =>{
    if(event.key === "Enter"){
        submitButton.click();
    }
});


clearButton.addEventListener("click", () =>{
    const checkedboxes = filter.querySelectorAll(".checkbox:checked");
    checkedboxes?.forEach(checkedbox =>{
        checkedbox.checked = false;
        search_input.value &&= "";
    });
});


const query_string = window.location.search.slice(1);
const queries = query_string && query_string.split("&");

const filtersCount = document.querySelector("[data-filter-count]");
if(queries.length){
    filtersCount.innerText = queries.length;
    filtersCount.style.display = "inline";
}

queries && queries.forEach(query =>{
    if(query.split("=")[0] === "q"){
        search_input.value = query.split("=")[1].replace(/%20/g, " ");
    } else{
        filter.querySelector(`[value="${query.split("=")[1].replace(/%20/g, " ")}"`).checked = true;
    }
});


const filterButton = document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", () =>{
    filterButton.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});


/* Rendering Recipes */
const cardList = document.querySelector("[data-card-list]");
const loadMore = document.querySelector("[data-load-more]");

cardList.innerHTML = skeletonTemplate.repeat(20);

const default_queries = [
    ["mealType", "breakfast"],
    ["mealType", "dinner"],
    ["mealType", "lunch"],
    ["mealType", "snack"],
    ["mealType", "teatime"],
    ...API.default_queries,
];
 
let nextPage = {available: false, URL: ""};

API.fetch(queries || default_queries, data =>{   
    if(data._links.next){
        nextPage = {available: true, URL: data._links.next.href};
    }

    cardList.innerHTML = "";

    if(data.hits.length){
        data.hits.forEach(item =>{
            const {image, label, totalTime, uri} = item.recipe;

            const cardElement = createCard(label, image, totalTime, uri);
            cardList.appendChild(cardElement);
            if(nextPage.available){
                loadMore.innerHTML = 
                `<div class="loading-container">
                    <div class="loading-circle"></div>
                    <div class="loading-circle"></div>
                    <div class="loading-circle"></div>
                </div>`;
            } else{
                loadMore.innerHTML = `<p class="info-text">No recipe found</p>`;
            }

        });

    }
});

window.addEventListener('scroll', async () => {

    if (loadMore.getBoundingClientRect().top + 96  < window.innerHeight && nextPage.available) {  // 96 = 80 mobile nav + 16 body padding
        const response = await fetch(nextPage.URL);                                              // css:  body{padding-bottom: calc(var(--mobile-nav-height) + 1em);}
        const data = await response.json();
        
        if(data._links.next){
            nextPage = {available: true, URL: data._links.next.href};
        } else{
            nextPage = {available: false, URL: ""};
            loadMore.innerHTML = `<p class="info-text">No more recipes</p>`;
        }   

        data.hits.forEach(item =>{
            const {image, label, totalTime, uri} = item.recipe;
    
            const cardElement = createCard(label, image, totalTime, uri);
            cardList.appendChild(cardElement);
        });
    }
});

