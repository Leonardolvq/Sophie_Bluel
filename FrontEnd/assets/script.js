//Fonction pour recevoir les données
let works;
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
    
    const refresh = document.querySelector('header a');
    refresh.addEventListener("click", async function(works){
        window.localStorage.removeItem('works')
        getData(works);
        generateWorks(works);
    })
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



//      BACKOFFICE      //

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

function activateBackoffice(){
    const token = localStorage.getItem("token");
    const backoffice = document.querySelector(".backoffice");
    const editBtns = document.querySelectorAll(".edit_btn");
    const filterMenu = document.querySelector(".filterContainer");

    if(token){
        backoffice.style.display = "block";
        editBtns.forEach((btn) => {
            btn.style.display = "inline";
          });      

        filterMenu.style.display = "none";
    }
}

function openBackoffice(){
    const portfolioEditBtn = document.querySelector("#portfolio .edit_btn");
    const modal = document.querySelector(".modal_container");

    portfolioEditBtn.addEventListener("click", function(){
        modal.style.display = "block";
    })
}

function closeBackoffice(){
    const cancelBtn = document.querySelector(".x_btn");
    const modal = document.querySelector(".modal_container")

    cancelBtn.addEventListener("click", function() {
        modal.style.display = "none";
    })
}


//Génère les thumbnail de la gallerie du modal
function generateThumbnails(works){
    const galleryModal = document.querySelector(".modal_content");
    galleryModal.innerHTML = "";
        
    for (let i = 0; i < works.length; i++){
        const project = works[i];

        const figure = document.createElement("figure");
        figure.dataset.id = project.id;

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("image_container");
        imgContainer.innerHTML = `
        <i class='fa-solid fa-arrows-up-down-left-right move_icon'></i>
        `;

        const deleteBtn = document.createElement('i');
        deleteBtn.classList.add("fa-solid", "fa-trash-can", "delete_icon");
        deleteBtn.dataset.id = project.id;

        const imgProjet = document.createElement("img");
        imgProjet.src = project.imageUrl;
        imgProjet.alt = project.title;

        const editBtn = document.createElement("span");
        editBtn.innerText = "éditer";

        galleryModal.appendChild(figure);
        figure.appendChild(imgContainer);
        imgContainer.appendChild(imgProjet)
        imgContainer.appendChild(deleteBtn)
        figure.appendChild(editBtn);
    }
}

generateThumbnails(works)


function deleteWork(works){
    const deleteBtns = document.querySelectorAll('.delete_icon');
    deleteBtns.forEach(deleteBtn => {
        const deleteBtnId = deleteBtn.dataset.id    
        deleteBtn.addEventListener("click", async function(event){   
            event.preventDefault();

            const token = window.localStorage.getItem("token");/*
            const response = await fetch(`http://localhost:5678/api/works/${deleteBtnId}`, {
                method: 'DELETE',
                headers: {
                  "accept": "application/json",
                  "Authorization": `Bearer ${token}`
                },
              })*/

              works = works.filter(work => work.id !== parseInt(deleteBtnId));

      // Mettre à jour les données dans le localStorage
      window.localStorage.setItem("works", JSON.stringify(works));

      console.log(`Le projet ${deleteBtnId} a correctement été supprimé`);
      console.log(works)
              
      const thumbnailToDelete = document.querySelector(`[data-id="${deleteBtnId}"]`);
      if (thumbnailToDelete) {
        thumbnailToDelete.remove();
      }
    });
  });
}

function Backoffice(){
    activateBackoffice();
    openBackoffice();
    closeBackoffice();
    deleteWork(works)
}

Backoffice();