function activateBackoffice(){
    const token = localStorage.getItem("token");
    const backoffice = document.querySelector(".backoffice");
    const editBtns = document.querySelectorAll(".edit_btn");
    const filterMenu = document.querySelector(".filterContainer");

    if(token){
        backoffice.style.display = "block";
        editBtns.forEach((btn) => {
            btn.style.display = "block";
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

export function Backoffice(){
    activateBackoffice();
    openBackoffice();
    closeBackoffice();
}
