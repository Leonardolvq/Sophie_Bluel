import { activateBackend, } from "./modale.js"

//Fonction pour recevoir les données
let works
async function getData() {

     works = window.localStorage.getItem("works");

    if (works === null) {
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();

        const valeurWorks = JSON.stringify(works);

        window.localStorage.setItem("works", valeurWorks);
        console.log(`From fetch`);
    } else {
        works = JSON.parse(works);
        console.log(`From localStorage`);
    }
}

getData();

//Fonction pour générer les travaux 
function generateWorks(works){
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
        
    for (let i = 0; i < works.length; i++){
        const project = works[i];

        const figure = document.createElement("figure");

        const imgProjet = document.createElement("img");
        imgProjet.src = project.imageUrl;
        imgProjet.alt = project.title

        const legendProject = document.createElement("figcaption");
        legendProject.innerText = project.title;


        gallery.appendChild(figure);
        figure.appendChild(imgProjet);
        figure.appendChild(legendProject);
    }
}

generateWorks(works);

//Fonction pour générer les boutons filtre
async function generateFiltersBtns(works) {

    const filterArray = [];
    const portfolio = document.getElementById("portfolio");
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filterContainer");

    const allBtn = document.createElement("button");
    allBtn.classList.add("filterBtn");
    allBtn.innerText = "Tous";
    allBtn.dataset.id = 123;

    filterContainer.appendChild(allBtn);

    portfolio.appendChild(filterContainer)

    
    for (let i = 0; i < works.length; i++){
        const filterBtn = document.createElement("button");
        filterBtn.classList.add("filterBtn");
    
        const category = works[i].category.id;
        filterBtn.innerText = works[i].category.name;
        
        if(filterArray.includes(category)){
            continue;
        } else {
            filterArray.push(category);
            filterBtn.dataset.id = works[i].category.id
        }
        
        filterContainer.appendChild(filterBtn);
    }

    const filterBtns = document.querySelectorAll(".filterBtn");
  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", filterSettings);
  });

}

generateFiltersBtns(works)


function filterSettings(event) {
    const categoryId = parseInt(event.target.dataset.id);

    if (categoryId === 123){
        generateWorks(works);
    } else {
        const filteredWorks = works.filter(function(work) {
            return work.category.id === categoryId;
    });

    console.log(categoryId);
    console.log(filteredWorks);

    generateWorks(filteredWorks);
    }
}

activateBackend();