const idFormReg = document.getElementById("IdFormReg");


idFormReg.addEventListener("submit", async(event) => {
    event.preventDefault();

    const data = new FormData(idFormReg);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    const response = await fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json", },
    });

    const result = await response.json();
    if (response.status === 200) {
        return window.location.replace("/login");
    }

});