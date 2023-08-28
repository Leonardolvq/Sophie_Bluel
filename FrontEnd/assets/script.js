
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
        generateWorks(works)
    } else {
        works = JSON.parse(works);
        console.log(`From localStorage`);

        generateWorks(works)
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

const refresh = document.querySelector('header a');
refresh.addEventListener("click", async function(){
    window.localStorage.removeItem('works');
    await getData()
    console.log("After removing works:", works);
})

//      BACKOFFICE      //

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
    const modal = document.querySelector(".modal_container")
    const cancelBtns = document.querySelectorAll(".x_btn");
    cancelBtns.forEach((closeBtn) => {
        closeBtn.addEventListener("click", function(event) {
            event.preventDefault();
            modal.style.display = "none";
            console.log(event)
        })
    })
}

//Génère les thumbnail de la gallerie du modal

function generateThumbnails(works){
    const galleryModal = document.querySelector(".modal_gallery");
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
            const token = window.localStorage.getItem("token");
            const response = await fetch(`http://localhost:5678/api/works/${deleteBtnId}`, {
                method: 'DELETE',
                headers: {
                  "accept": "application/json",
                  "Authorization": `Bearer ${token}`
                },
              })
              works = works.filter(work => work.id !== parseInt(deleteBtnId));
      // Mettre à jour les données dans le localStorage

      window.localStorage.setItem("works", JSON.stringify(works));

      console.log(`Le projet ${deleteBtnId} a correctement été supprimé`);
              
      const thumbnailToDelete = document.querySelector(`[data-id="${deleteBtnId}"]`);
      if (thumbnailToDelete) {
        thumbnailToDelete.remove();
      }
    });
  });
}

// FORMULAIRE NEW WORK DU MODAL
const page2 = {
    page: "ajouterUnePhoto",
    contenu : `            
    <form method="post" id="form_add_work">
        <div class="dropZone">
            <div class="input_img_container" id="input_img_container">
                <i class="fa-regular fa-image"></i>
                <label for="input_file">+ Ajouter photo</label>
                <input type="file" id="input_file" hidden name="photo" accept="image/png, image/jpeg, image/jpg" required/>
                <p>jpg, png : 4mo max</p>
            </div>
            <img id="image-preview" class="image-preview">
        </div>
        <label for="titre">Titre</label>
        <input type="text" id="title" title="title" placeholder="Titre" required/>
        <label for="Catégorie">Catégorie</label>
        <select name="categories" id="categorie-select" required>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotels & restaurants</option>
        </select>
        <div class="separator"></div>
        <input class="valid_button" type="submit" value="Valider" disabled="disabled">
    </form>
            `
}

// FONCTION POUR RETOURNER SUR LA PAGE DE LA GALERIE THUMBNAILS
function switchThumbnailPage() {
    if (goBackBtn) {
        goBackBtn.addEventListener("click", function() {
            modalContent.innerHTML = initialModalContent;
            goBackBtn.classList.add('hide');
            modalHeader.classList.remove('page2');
        });
    }
}

// FONCTION POUR AFFICHER IMAGE DU FORMULAIRE
function handleImageUpload() {
    const image = document.querySelector(".selected_image");
    const input = document.querySelector("#input_file");

    input.addEventListener("change", ()=>{
        image.src = URL.createObjectURL(input.files[0]);
    });
}

// DéCLARATION DE VARIABLES NéCESSAIRES POUR LA MODAL
const ajouterUnePhoto = document.querySelector('.add_picture');
const goBackBtn = document.querySelector('.goBack_btn');
const modalContent = document.querySelector('.modal_content');
const modalHeader = document.querySelector(".modal_header_buttons");
const initialModalContent = modalContent.innerHTML;

// FONCTION POUR LE BOUTON AJOUTER PHOTO DEPUIS LA GALERIE THUMBNAILS POUR ALLER SUR LA PAGE DU FORMULAIRE NEW WORK
function NewWorkForm() {
    if (ajouterUnePhoto) {
        ajouterUnePhoto.addEventListener("click", function() {
            modalContent.innerHTML = page2.contenu;
            goBackBtn.classList.remove('hide');
            modalHeader.classList.add('page2');
            switchThumbnailPage();

            // Sélectionner les éléments du formulaire
            const imagePreview = document.getElementById('image-preview');
            const inputContainer = document.getElementById('input_img_container');
            const newImg = document.getElementById('input_file');
            const newTitle = document.getElementById('title');
            const newCategory = document.getElementById('categorie-select');
            const submitButton = document.querySelector('.valid_button');
            const dropZone = document.querySelector('.dropZone');
            const formulaire = document.getElementById('form_add_work');

            // FONCTION POUR AFFICHER L'IMG SÉLÉCTIONNÉE
            newImg.addEventListener('change', function() {
                const selectedImage = newImg.files[0];

                if (selectedImage) {
                    const imageURL = URL.createObjectURL(selectedImage);
                    imagePreview.src = imageURL;
                    // POUR CACHER TOUS LES ÉLÉMENTS DE LA DIV À L'AFFICHAGE DE L'IMG
                    inputContainer.style.display = 'none'; 
                } else {
                    imagePreview.src = ''; // EFFACER L'IMAGE SI AUCUN FICHIER N'EST SÉLECTIONNÉ
                    inputContainer.style.display = 'flex'; 
                }
            });


            
            // VALIDATION DU FORMULAIRE D'AJOUT DE NOUVEAU PROJET
            
            function checkFormValidity() {
                const isImageSelected = newImg.files[0];
                const isTitleFilled = newTitle.value.trim() !== '';
                const isCategorySelected = newCategory.value !== '';
            
                if (isImageSelected && isTitleFilled && isCategorySelected) {
                    submitButton.removeAttribute('disabled');
                } else {
                    submitButton.setAttribute('disabled', 'disabled');
                }
            }

            newImg.addEventListener('input', checkFormValidity);
            newTitle.addEventListener('input', checkFormValidity);
            newCategory.addEventListener('change ', checkFormValidity);

            formulaire.addEventListener('submit', async function (event) {
                event.preventDefault();
            
                // Code pour valider le formulaire (checkFormValidity) ou tout autre traitement nécessaire
            
                const formData = new FormData();
                formData.append('image', newImg.files[0]);
                formData.append('title', newTitle.value);
                formData.append('category', newCategory.value);

                
                const token = localStorage.getItem("token");
                try {
                console.log("Avant la requête POST");
                    const response = await fetch('http://localhost:5678/api/works', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`},
                        body: formData
                    });
                console.log("Après la requête POST");
                    if (response.ok) {
                        const newWork = await response.json();
                        works.push(newWork);
                        window.localStorage.setItem("works", JSON.stringify(works)); 
                        generateWorks(works);
                        console.log(`Le projet ${newTitle} a correctement été ajouté`);
                    } else {
                        console.log(`L'ajout de ${newTitle} a échoué`, response.statusText);
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                }
            });
        });
    }
}





function Backoffice(){
    activateBackoffice();
    openBackoffice();
    closeBackoffice();
    deleteWork(works);
    NewWorkForm ();
}

Backoffice();