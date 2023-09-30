// FONCTION POUR RÉCUPÉRER LES DONNÉES
let works;
async function getData() {

     works = window.localStorage.getItem("works");

    if (works === null) {
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();

        const valeurWorks = JSON.stringify(works);
        window.localStorage.setItem("works", valeurWorks);

        generateWorks(works)
    } else {
        works = JSON.parse(works);

        generateWorks(works)
    }
}
getData();

// FONCTION POUR GÉNÉRER LES TRAVAUX AFFICHÉS
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


// FONCTION POUR GÉNÉRER LES BOUTONS FILTRE
async function generateFiltersBtns(works) {

    const filterArray = [];
    const portfolio = document.getElementById("portfolio");
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filterContainer");

    // BOUTON "TOUS"
    const allBtn = document.createElement("button");
    allBtn.classList.add("filterBtn", "selected");
    allBtn.innerText = "Tous" ;

    allBtn.dataset.id = 123; // 123 EST L'ID POUR LE BOUTON FILTRE "TOUS"

    filterContainer.appendChild(allBtn);
    portfolio.appendChild(filterContainer);

    for (let i = 0; i < works.length; i++) {

        const project = works[i];

        // CONDITION POUR VÉRIFIER SI LA PROPRIÉTÉ 'CATEGORY' EXISTE
        if (!project.category) {
            continue;
        }

        const filterBtn = document.createElement("button");
        filterBtn.classList.add("filterBtn");

        const category = project.category.id;
        filterBtn.innerText = project.category.name;

        if (filterArray.includes(category)) {
            continue;
        } else {
            filterArray.push(category);
            filterBtn.dataset.id = category;
        }

        filterContainer.appendChild(filterBtn);
    }

    const filterBtns = document.querySelectorAll(".filterBtn");
    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", filterSettings);
    });
}
generateFiltersBtns(works);


function filterSettings(event) {

    const clickedBtn = event.target;
    const categoryId = parseInt(clickedBtn.dataset.id);
    const filterBtns = document.querySelectorAll(".filterBtn");

    // DÉSACTIVER TOUS LES AUTRES BOUTONS SAUF CELUI CLIQUÉ
    filterBtns.forEach(function(btn) {
        if (btn !== clickedBtn) {
            btn.classList.remove("selected");
        }
    });

    // METTRE À JOUR LA CLASSE DU BOUTON CLIQUÉ
    clickedBtn.classList.add("selected");

    if (categoryId === 123) {
        generateWorks(works);
    } else {
        const filteredWorks = works.filter(function(work) {
            return parseInt(work.categoryId) === categoryId;
        });
        generateWorks(filteredWorks);
    }
}


//      BACKOFFICE      //


function activateBackoffice() {
    
    const token = localStorage.getItem("token");
    const backoffice = document.querySelector(".backoffice");
    const editBtns = document.querySelectorAll(".edit_btn");
    const filterMenu = document.querySelector(".filterContainer");

    if (token) {

        // POUR AFFICHER LES BOUTONS DE MODIFICATION
        backoffice.style.display = "block";
        editBtns.forEach((btn) => {
            btn.style.display = "inline";
        });

        filterMenu.style.display = "none";

        const portfolioEditBtn = document.querySelector("#portfolio .edit_btn");
        const modal = document.querySelector(".modal_container");
        const cancelBtns = document.querySelectorAll(".x_btn");

        // POUR OUVRIR LA MODALE
        portfolioEditBtn.addEventListener("click", function () {
            modal.style.display = "block";
        });

        // POUR FERMER LA MODALE --
        // -- PAR LA CROIX
        cancelBtns.forEach((closeBtn) => {
            closeBtn.addEventListener("click", function (event) {
                event.preventDefault();
                modal.style.display = "none";
            });
        });
        // -- PAR L'OVERLAY
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
} 
activateBackoffice();


// GÉNÈRE LES THUMBNAIL DE LA GALLERIE DU MODAL

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

function deleteWork(works){

    const deleteBtns = document.querySelectorAll('.delete_icon');
    deleteBtns.forEach(deleteBtn => {
        const deleteBtnId = deleteBtn.dataset.id    
        deleteBtn.addEventListener("click", async function(event){   
            event.preventDefault();
            const token = window.localStorage.getItem("token");
            await fetch(`http://localhost:5678/api/works/${deleteBtnId}`, {
                method: 'DELETE',
                headers: {
                  "accept": "application/json",
                  "Authorization": `Bearer ${token}`
                },
              })
              works = works.filter(work => work.id !== parseInt(deleteBtnId));
      // Mettre à jour les données dans le localStorage

      window.localStorage.setItem("works", JSON.stringify(works));
              
      const thumbnailToDelete = document.querySelector(`[data-id="${deleteBtnId}"]`);
      if (thumbnailToDelete) {
        thumbnailToDelete.remove();
        generateWorks(works);
      }
    });
  });
}

// FORMULAIRE NEW WORK DU MODAL
const modalForm = {
    page: "ajouterPhoto",
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

// DéCLARATION DE VARIABLES NéCESSAIRES POUR LA MODAL
const ajouterPhoto = document.querySelector('.add_picture');
const goBackBtn = document.querySelector('.goBack_btn');
const modalContent = document.querySelector('.modal_content');
const modalHeader = document.querySelector(".modal_header_buttons");

// FONCTION POUR LE BOUTON "AJOUTER PHOTO" DEPUIS LA GALERIE THUMBNAILS POUR ALLER SUR LA PAGE DU FORMULAIRE NEW WORK
function NewWorkForm() {

    // Vérifie si le bouton "Ajouter Photo" existe
    const ajouterPhoto = document.querySelector('.add_picture');
    if (ajouterPhoto) {

        // Ajoute un écouteur d'évènement pour le clic sur "Ajouter Photo"
        ajouterPhoto.addEventListener("click", function() {

            // Remplace le contenu de la modal par le formulaire de création d'un nouveau projet
            modalContent.innerHTML = modalForm.contenu;
            goBackBtn.classList.remove('hide');
            modalHeader.classList.add('modalForm');
            switchThumbnailPage();

            // Sélectionner les éléments du formulaire
            const imagePreview = document.getElementById('image-preview');
            const inputContainer = document.getElementById('input_img_container');
            const newImg = document.getElementById('input_file');
            const dropZone = document.querySelector('.dropZone');

            // Met à jour l'aperçu de l'image séléctionnée via le bouton de sélection 
            function updateImagePreview() {
                const selectedImage = newImg.files[0];

                if (selectedImage) {
                    const imageURL = URL.createObjectURL(selectedImage);
                    imagePreview.src = imageURL;
                    inputContainer.style.display = 'none';
                } else {
                    imagePreview.src = '';
                    //inputContainer.style.display = 'flex';
                }
            }

            // Met à jour l'aperçu de l'image lorsque l'utilisateur sélectionne une image
            newImg.addEventListener('change', function() {
                updateImagePreview();
            });

            // Permet le drag-n-drop
            dropZone.addEventListener("dragover", function(event) {
                event.preventDefault();
            });

            // Met à jour l'image séléctionnée avec le drag-n-drop
            dropZone.addEventListener("drop", function(event) {
                event.preventDefault();
                newImg.files = event.dataTransfer.files;
                updateImagePreview();
            });
            
            const newTitle = document.getElementById('title');
            const submitButton = document.querySelector('.valid_button');
            const newCategory = document.getElementById('categorie-select');

            // CONDITIONS DE VALIDATION DU FORMULAIRE  
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

            const formulaire = document.getElementById('form_add_work');

            formulaire.addEventListener('submit', async function (event) {
                event.preventDefault();

                const formData = new FormData();
                formData.append('image', newImg.files[0]);
                formData.append('title', newTitle.value);
                const newCategory = parseInt(document.getElementById('categorie-select').value);
                formData.append('category', newCategory);

                const token = localStorage.getItem("token");
                try {
                    const response = await fetch('http://localhost:5678/api/works', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`},
                        body: formData
                    });

                    if (response.ok) {
                        const newWork = await response.json();
                        works.push(newWork);
                        window.localStorage.setItem("works", JSON.stringify(works)); 
                        generateWorks(works);
                        window.location.href = "index.html"; // Retourne page d'accueil
                    }

                } catch (error) {
                    console.error('An error occurred:', error);
                }
            });
        });
    }
}

const initialModalContent = modalContent.innerHTML;

// FONCTION POUR RETOURNER SUR LA PAGE DES THUMBNAILS
function switchThumbnailPage() {
    if (goBackBtn) {
        goBackBtn.addEventListener("click", function() {
            modalContent.innerHTML = initialModalContent;
            goBackBtn.classList.add('hide');
            modalHeader.classList.remove('modalForm');
            Backoffice();
        });
    }
}

function Backoffice(){
    generateThumbnails(works);
    deleteWork(works);
    NewWorkForm();
}

Backoffice();