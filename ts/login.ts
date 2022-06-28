import {logincontroller} from './settings.env.js';

function login(e: Event){
    const inputlogin = <HTMLInputElement>document.getElementById("login");
    const inputpassword = <HTMLInputElement>document.getElementById("password");
    if(inputlogin == null || inputpassword == null) throw new Error("Login or password fields not found");
    const login = inputlogin.value;
    const password = inputpassword.value;
    const data = {login: login, password: password};
    fetch(logincontroller, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {if(data.error == 0) window.location.href = "/panel.html"; else alert("Login failed");});
}

window.addEventListener("load", (e)=>{
    console.log("Load");
    const loginButton = document.getElementById("btlogin");
    if(loginButton === null) throw new Error("Login button not found");
    loginButton.addEventListener("click", login);
}, false);