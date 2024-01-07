async function addProduct(id) {
    const cart = getCookie("cart");
    if (cart) {
        const response = await fetch(`/api/carts/${cart}/products/${id}`, { method: "PUT", });
        const result = await response.json();
    } else {
        const response = await fetch(`/api/carts/products/${id}`, {
            method: "PUT",
        });
        const result = await response.json();
    }

  Toastify({
    text: "Next article",
    duration: 2000,
  }).showToast();
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

const addButton = document.querySelectorAll("adeddButton");
