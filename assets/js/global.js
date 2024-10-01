export function createCard(label, image, cookingTime, uri){

    const recipe_id = uri.slice(uri.lastIndexOf("_") + 1);

    // Check if the recipe is saved
    let is_saved = false;
    if(window.localStorage.getItem("cook.io-" + recipe_id)){
        is_saved = true;
    }

    const time = getTime(cookingTime);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = 
    `<figure>
        <img class="card-thumble" src="${image}" alt="${label}" loading="lazy" width="195" height="195">
    </figure>
    <h3 class="title-small">
        <a href="./detail.html?recipe_id=${recipe_id}" class="card-link">${label ?? "Untiteled"}</a>
    </h3>
    <div class="meta-items">
        <span class="meta-duration">
            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
            <span class="label-medium"> ${time.duration || "<1"} ${time.unit}</span>
        </span>
        <button class="icon-btn has-state ${is_saved ? 'saved' : 'unsaved'}" onclick="saveRecipe('${recipe_id}', element = this)">
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
        </button>
    </div>`;

    return card;
}

window.saveRecipe = function (recipeid, element){   
    if(window.localStorage.getItem("cook.io-" + recipeid)){
        window.localStorage.removeItem("cook.io-" + recipeid);
        element.classList.remove("saved");
        element.classList.add("unsaved");
        notification("Removed from Recipe book");

        if(window.location.toString().endsWith("saved-recipes.html")){
            element.parentElement.parentElement.remove();
        }
        
    } else{
        window.localStorage.setItem(("cook.io-" + recipeid), "saved");
        element.classList.remove("unsaved");
        element.classList.add("saved");
        notification("Added to Recipe book");

    }
}

export function getTime(minutes){
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



const snackbarContainer = document.createElement("div");
snackbarContainer.classList.add("snackbar-container");
window.document.body.appendChild(snackbarContainer);

function notification(messsage){
    const snackbar = document.createElement("div");
    snackbar.classList.add("snackbar");
    snackbar.innerHTML = `<div class=<p class="body-medium">${messsage}</p>`;
    snackbar.addEventListener("animationend", () =>{
        snackbar.remove();
    });

    snackbarContainer.appendChild(snackbar);
}

export const skeletonTemplate =
`<div class="skeleton-card">
    <div class="skeleton skeleton-card-thumble"></div>
    <div class="skeleton-body">
        <div class="skeleton skeleton-card-title"></div>
        <div class="skeleton skeleton-card-text"></div>
    </div>
</div>`;
