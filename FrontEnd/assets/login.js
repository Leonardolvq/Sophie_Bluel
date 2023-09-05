async function validateForm(){

    const formLogin = document.getElementById("form-login");
    formLogin.addEventListener("submit", async function connexion(event){
        event.preventDefault() 
            
        const identifiant = document.getElementById("email");
        const password = document.getElementById("password");
        
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json" },
            body: JSON.stringify({
                email: identifiant.value,
                password: password.value
            })
        })
        
        if (response.ok) {
            const res = await response.json();
            const token = res.token;

            localStorage.setItem("token", token)

            if(token){
                window.location.href = "index.html";
            }
        } else {
            console.log("Erreur lors de la requête :", response.status);
        }
    })
}

validateForm();

function removeToken(){
    const SophieBluelBtn = document.querySelector('header a');
    const token = window.localStorage.getItem('token');

    SophieBluelBtn.addEventListener("click", function(){
        localStorage.removeItem('token');
    })
}

removeToken()