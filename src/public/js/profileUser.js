const profile = document.getElementById("profile");
const logoutButton = document.getElementById("logout");

if (logoutButton) {
  logoutButton.addEventListener("click", adios);
}

const renderUserView = (payload) => {
  let content;
  switch (payload.role) {
    case "user":
      if (payload.isPremium === false) {
        content = `
          <h4 class="profileName">Hola ${payload.name}</h4>
          <p class="profileEmail">Email: ${payload.email}</p>
          <p class="profileRole">Rol: ${payload.role}</p>
          
        `;
      } else {
        content = `
                  `;
      }
      break;

    case "premium":
      content = `
          
      `;
      break;

    case "admin":
      content = `
        
      `;
      break;

    default:
      content = "Rol no reconocido";
  }

  profile.innerHTML = `
    <div>${content}</div>
  `;
};

const fetchCurrentUser = async () => {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.payload);
      renderUserView(result.payload);
      return result.payload;
    }
  } catch (error) {
    console.error(error);
  }
};

async function adios() {
  console.log("adios");
  try {
    const response = await fetch("/api/sessions/logout", {
      method: "GET",
    });

    if (response.status === 200) {
      window.location = "/";
    }
  } catch (error) {
    console.error(error);
  }
}

async function premium() {
  window.location = "/premium";
}

async function productCreator() {
  window.location = "/productCreator";
}

const updateUserPremiumStatus = async (uid) => {
  fetchCurrentUser();
  const premiumUser = await fetch(`/api/users/premium/${uid}`, {
    method: "PUT",
  })
    .then((res) => res.json())
    .then((data) => {
      renderUserView(data.payload.role);
    });
};

fetchCurrentUser();
renderUserView();
