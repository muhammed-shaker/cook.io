const HTMLDoc = document.documentElement;
const themeToggleButton = document.getElementById('theme-toggle-btn');

themeToggleButton.addEventListener('click', () =>{
    const currentTheme = HTMLDoc.dataset.theme;
    HTMLDoc.dataset.theme = (currentTheme === "dark") ? "light" : "dark";
    localStorage.setItem("theme", (currentTheme === "dark") ? "light" : "dark");
})

// Default Theme
const  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if(localStorage.getItem("theme")){
    HTMLDoc.dataset.theme = localStorage.getItem("theme");
} else{
    HTMLDoc.dataset.theme = (isDark ? "dark" : "light")
}