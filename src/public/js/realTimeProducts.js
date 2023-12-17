const socketClient = io();

socketClient.on("prodList", (data) => {
  updateProductList(data);
});

function updateProductList(listProducts) {
  const div = document.getElementById("containerBody");

  let productos = listProducts;
  let products = "";
  div.innerHTML = "";
  productos.forEach((product) => {
    products += `<div class="card" id="card${product.id}">
                    <div class="card-body">
                      <img src="${product.thumbnail}" width="150"class="card-img-top" alt="${product.title}"/>
                      <h5 class="card-title">${product.title}</h5>
                      <div class="card-info">
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Categoría:${product.category}</p>
                        <p class="card-text">Código:${product.code}</p>
                        <p class="card-text">Stock:${product.stock}</p>
                        <p class="card-text">Precio: $${product.price}</p>
                        <button id="${product._id}" class="deleteButton">🗑️</button>
                        
                      </div >
                    </div >
                 </div >`;

    div.innerHTML = products;
  });
}
const form = document.getElementById("idForm");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;

  socketClient.emit("updateProduct", {
    title,
    description,
    stock,
    thumbnail,
    category,
    price,
    code,
  });

  form.reset();
});

document.getElementById("deleteButton").addEventListener("click", (e) => {
  const deleteIdInput = document.getElementById("pid");
  const deleteId = parseInt(deleteIdInput.value);
  socketClient.emit("deleteButton", idArt);
  deleteIdInput.value = "";
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Producto eliminado",
    showConfirmButton: false,
    timer: 1500,
  });
});
////////////////////////////////
// const socket = io();

// let idForm = document.getElementById("idForm");
// idForm.addEventListener("click", (e) => { e.preventDefault(); });

// function idFormEvent() {
//     let title = idForm.elements.title.value;
//     let description = idForm.elements.description.value;
//     let stock = idForm.elements.stock.value;
//     let thumbnail = idForm.elements.stock.value;
//     let category = idForm.elements.stock.value;
//     let price = idForm.elements.stock.value;
//     let code = idForm.elements.code.value;
//     const attributes = { title, description, stock, thumbnail, category, price, code };
//     socket.emit("updateProduct", attributes);
//     // console.log(attributes);
//     idForm.reset();
// };
// function deleteArticle() {
//     let deleteArticle = document.getElementsByClassName("deleteButton");
//     let idArt = null;
//     for (i in deleteArticle) {
//         deleteArticle[i].onclick = (e) => {
//             idArt = e.target.attributes.id.nodeValue;
//             articleDeleted(idArt);
//         };

//     }

// }
// function articleDeleted(idArt) {
//     socket.emit("deleteButton", idArt);
// }
// const prodForm = document.getElementById("idForm");
// prodForm.addEventListener("click", (elements) => {
//     elements.preventDefault();
// });
// function submitHandlebars() {

//     let title = prodForm.elements.title.value;
//     let description = prodForm.elements.description.value;
//     let stock = prodForm.elements.stock.value;
//     let thumbnail = prodForm.elements.thumbnail.value;
//     let category = prodForm.elements.category.value;
//     let price = prodForm.elements.price.value;
//     let code = prodForm.elements.code.value;

//     const dataSubmit = {
//         title,
//         description,
//         stock,
//         thumbnail,
//         category,
//         price,
//         code,

//     };
//     socket.emit("updateProduct", dataSubmit);
//     prodForm.reset();
// };

// socket.on("prodList", (data) => {
//     const containerBody = document.getElementById("containerBody");
//     let products = "";
//     data.payload.forEach((e) => {
//         products += `
//         <tr key=${e._id}>
//         <td>${e._id}</td>
//         <td>${e.title}</td>
//         <td>${e.description}</td>
//         <td>${e.category}</td>
//         <td>${e.price}</td>
//         <td>${e.thumbnail}</td>
//         <td>${e.code}</td>
//         <td>${e.stock}</td>
//         <td>${e.status}</td>
//         <td><button id="${e._id}" class="deleteButton">🗑️</button></td></tr>`;
//     });
//     containerBody.innerHTML = products;
//     deleteArticle();
// });
