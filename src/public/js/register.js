const  idFormReg = document.getElementById('IdFormReg');


idFormReg.addEventListener("submit",async (e)=>{
    e.preventDefault();

const data= new FormData(idFormReg);
const obj= {};
data.forEach(( value, key)=>obj[key]= value);
const response = await fetch('/api/session/register',{
    method:'POST',
    body:JSON.stringify(obj),
    headers:{"Content-Type":'application/json'}})

const result = await response.json();
    window.location.replace("/login");


})
// async function adios() {
//     try {
//         let adios = await fetch(`/api/session/logout`, {
//             method: "get",
//         });
        
//         return window.location = "/";
//     } catch (error) {
//         console.log(error);
//     }
// }

// let logoutElement = document.getElementById("adios");
// logoutElement.onclick = adios;
