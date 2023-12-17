async function addProduct(id) {
    const cart = getCARTCookies("cart");
    if (!cart) {
        const response = await fetch(`(api/carts/products/${id})`, { method: "PUT", })
        const result = await response.json();
    } else {
        const response = await fetch(`/api/carts/${cart}/products/${id}`, { method: "PUT", });
        const result = await response.json();
    }
}
function getCARTCookies(name) {
    const cookieValue = `; ${document.cookie}`;
    const parts = cookieValue.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(";").shift();
}

