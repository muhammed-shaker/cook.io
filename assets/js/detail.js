'use strict';

import { API } from "./api.js";
import {getTime} from "./global.js";

const recipe_ID = window.location.search.slice(11);
const request_URL = `${API.accessPoint}/${recipe_ID}?app_id=${API.application_ID}&app_key=${API.key}&type=${API.type}`;

const response = await fetch(request_URL);
const data = await response.json();

const {
    images,
    label: title,
    source: author,
    totalTime = 0,
    calories = 0,
    cuisineType = [],
    dietLabels = [],
    dishType = [],
    ingredients = [],
    ingredientLines = [],
    yield: servings = 0,
    uri,

} = data.recipe;

window.document.title = `${title} - cook.io`;

const banner = images.LARGE  ?? images.REGULAR ?? images.SMALL ?? images.THUMBNAIL ;
const tags = [...cuisineType, ...dietLabels, ...dishType];        
const time = getTime(totalTime);  

const recipe_id = uri.slice(uri.lastIndexOf("_") + 1);

// Check if the recipe is saved
let is_saved = false;
if(window.localStorage.getItem("cook.io-" + recipe_id)){
    is_saved = true;
}

const recipe = document.querySelector("[data-recipe]");
recipe.innerHTML =
`<figure class="recipe-details__banner">
    <img src="${banner.url}" width="${banner.width}" height="${banner.height}">
</figure>
<div class="recipe-detail-content">
    <div class="recipe-details__title">
        <h1 class="display-small">${title ?? "Untitled"}</h1>
        <button class="btn btn-secondary has-state has-icon ${is_saved ? 'saved' : 'unsaved'}" onclick="saveRecipe('${recipe_id}', element = this)"">
            <span class="material-symbols-outlined unsaved-icon" aria-hidden="true">bookmark_add</span>
            <span class="label-large unsaved-txt">Unsaved</span>

            <span class="material-symbols-outlined saved-icon" aria-hidden="true">bookmark</span>
            <span class="label-large saved-txt">saved</span>
        </button>
    </div>
    <div class="recipe-details__author label-large">
        <span class="by">by</span> ${author}
    </div>
    <div class="recipe-details__stats">
        <div class="recipe-details__stats__item">
            <span class="display-medium">${ingredients.length}</span>
            <span class="label-medium">Ingredients</span>
        </div>
        <div class="recipe-details__stats__item">
            <span class="display-medium">${time.duration || "<1"}</span>
            <span class="label-medium">${time.unit}</span>
        </div>
        <div class="recipe-details__stats__item">
            <span class="display-medium">${Math.floor(calories)}</span>
            <span class="label-medium">Calories</span>
        </div>
    </div>
    <div class="recipe-details__tags">
        ${tags.map( tag =>{

            let key = "cuisineType";
            if(dishType.includes(tag)){
                key = "dishType";
            }
            else if(dietLabels.includes(tag)){
                key = "diet";
            }

            return `<a class="recipe-details__tags__tag label-large has-state" href="./recipes.html?${key}=${tag.toLowerCase()}">${tag}</a>`;
        }).join("")}
    </div>
    <div class="recipe-details__ingr">
        <h2 class="recipe-details__ingr__title title-medium">
            Ingredients
            <span class="label-medium">for ${servings} ${servings === 1 ? "Serving" : "Servings"}</span>
        </h2>
        <ul class="recipe-details__ingr__list">
            ${ingredientLines.map(line =>{
                return `<li>${line}</li>`;
            }).join("")}
        </ul>
    </div>
</div>`;




