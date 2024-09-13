"use strict";

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
    });
});