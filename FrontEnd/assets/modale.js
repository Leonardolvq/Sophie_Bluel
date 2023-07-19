export  function activateBackend(){
    const token = localStorage.getItem("token");
    const backend = document.getElementById("client_side")

    if(token){
        backend.classList.remove('hide')
    }
}

/*
export function closeBackend(){
    const cancelBtn = document.querySelector(".cancel_modal");
    const modal = document.querySelector(".modal")

    cancelBtn.addEventListener("click", function() {
        closeBackend();
        modal.classList.add('hide');
    })
}
*/

