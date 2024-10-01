"use strict";

import {API} from "./api.js";
import {createCard, skeletonTemplate} from "./global.js";


let saved_IDs = [];
Object.keys(window.localStorage).forEach(key =>{
    if(key.startsWith("cook.io")){
        saved_IDs.push(key.slice(8));
    }
});

const cardList = document.querySelector("[data-card-list]");
cardList.innerHTML = skeletonTemplate.repeat(saved_IDs.length);

let cards = [];

saved_IDs.forEach(async ( recipe_ID, index) =>{
    const request_URL = `${API.accessPoint}/${recipe_ID}?app_id=${API.application_ID}&app_key=${API.key}&type=${API.type}`;
    const response = await fetch(request_URL);
    const data = await response.json();
    const {image, label, totalTime, uri} = data.recipe;
    cards.push(createCard(label, image, totalTime, uri));
});

cardList.innerHTML = "";

cardList.append(...cards);

