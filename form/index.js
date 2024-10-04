class FruitManager {
  constructor() {
    this.edit = false;
    this.init();
  }

  init() {
    this.fetchFruit();

    document
      .getElementById("fruit-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });

    document.addEventListener("click", async (e) => {
      if (e.target.closest(".edit")) {
        await this.handleEdit(e);
      } else if (e.target.closest(".delete")) {
        await this.handleDelete(e);
      } else if (e.target.closest(".icon")) {
        this.clearInput(e);
      }
    });
  }

  async handleSubmit() {
    const postData = {
      name: document.getElementById("fruit").value,
      url: document.getElementById("imgUrl").value,
      id: document.getElementById("hiddenId").value,
    };

    if (!postData.name) {
      const alert = document.querySelectorAll(".alert")[0];
      alert.style.visibility = "visible";
      setTimeout(() => {
        alert.style.visibility = "hidden";
      }, 3000);

      return;
    }

    if (!postData.url) {
      const alert = document.querySelectorAll(".alert")[1];
      alert.style.visibility = "visible";
      setTimeout(() => {
        alert.style.visibility = "hidden";
      }, 3000);

      return;
    }

    const url =
      this.edit === false
        ? "/test_desarrollo/server/addItem.php"
        : "/test_desarrollo/server/editFruit.php";

    try {
      await this.postData(url, postData);
      document.getElementById("fruit-form").reset();
      await this.fetchFruit();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  }

  async fetchFruit() {
    try {
      const response = await fetch("/test_desarrollo/server/fruitList.php");
      const fruits = await response.json();

      let template = "";
      fruits.forEach((fruit) => {
        template += `
          <div class="item" data-id=${fruit.id}>
            <img src="${fruit.url}" alt="fruit-photo">
            <span class="text-box">
              <p>${fruit.name}</p>
              <span class="edit au"><i class="bi bi-pencil-square"></i></span>
              <span class="delete au"><i class="bi bi-trash"></i></span>
            </span>
          </div>
        `;
      });
      document.querySelector(".table-list").innerHTML = template;
    } catch (error) {
      console.error("Error fetching fruits:", error);
    }
  }

  async handleEdit(e) {
    e.preventDefault();
    const element = e.target.closest(".item");
    const id = element.getAttribute("data-id");
    console.log(id);
    try {
      const response = await this.postData(
        "/test_desarrollo/server/editItem.php",
        { id }
      );
      console.log("Respuesta del servidor:", response);

      if (response.error) {
        console.error("Error del servidor:", response.error);
        alert("Error: " + response.error);
        return;
      }

      document.getElementById("fruit").value = response.name;
      document.getElementById("imgUrl").value = response.url;
      document.getElementById("hiddenId").value = response.id;
      this.edit = true;
    } catch (error) {
      console.error("Request failed:", error);
      alert("Error en la solicitud: " + error.message);
    }
  }

  async handleDelete(e) {
    if (confirm("Are you sure you want to delete it?")) {
      const element = e.target.closest(".item");
      const id = element.getAttribute("data-id");

      try {
        await this.postData("/test_desarrollo/server/fruitDelete.php", { id });
        await this.fetchFruit();
      } catch (error) {
        console.error("Error deleting fruit:", error);
      }
    }
  }

  clearInput(e) {
    e.preventDefault();
    const icon = e.target.closest(".icon");
    const input = icon.parentNode.querySelector("input");
    input.value = "";
  }

  async postData(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({ ...data }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error in postData:", error);
      throw error;
    }
  }
}

// Iniciar la clase FruitManager cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new FruitManager();
});
