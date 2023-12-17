// async function addToCart(id) {
//     const cart = getCookie("cart");
//     try {
//         const response = await fetch(`/api/carts/${cart}/products/${id}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json", },
//         });
//         await counter();
//         await siteCart();
//     } catch (error) {
//         console.log(error);


//     }
// }

// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
// }

// const addButton = document.querySelectorAll(".adeddButton");

// async function siteCart() {
//     let siteCart = document.getElementById("cart");
//     let idCart = await validarCarrito();
//     if (idCart) {
//         siteCart.href = `http://localhost:8080/cart/${await idCart}`;
//     } else {
//         siteCart.href = "";
//     }
// }

// siteCart();
// let counter = 0;

// let countCart = document.getElementById("counter");

// async function counter() {
//     let user = await JSON.parse(sessionStorage.getItem("cart"));
//     let idCart = "";
//     if (user) {
//         idCart = await user;
//         let getCart = await fetch(`/api/carts/${idCart}`, {
//             method: "get",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         let cartList = await getCart.json();
//         let prodList = await cartList[0].products;
//         counter = prodList.length;
//     } else {
//         counter = 0;
//     }
//     countCart.innerHTML = counter;

//     console.log(counter);

// }

// counter();
// async function getCookie() {
//     let user = await JSON.parse(sessionStorage.getItem("cart"));

//     let idCart = "";
//     if (user) {
//         idCart = await user;
//     } else {
//         let newCart = await fetch("/api/carts", {
//             method: "post",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         let cartList = await newCart.json();
//         idCart = await cartList._id;
//     }
//     sessionStorage.setItem("cart", JSON.stringify(idCart));
//     return idCart;
// }
// function addArtButton() {
//     let buttonAdd = document.getElementsByClassName("addButton");
//     let idArtAdded = null;
//     for (i in buttonAdd) {
//         buttonAdd[i].onclick = (e) => {
//             idArtAdded = e.target.attributes.id.nodeValue;
//             addToCart(idArtAdded);
//         };
//     }
// }
// addArtButton();
