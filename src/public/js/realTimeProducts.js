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
