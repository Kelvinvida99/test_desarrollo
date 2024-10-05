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
    const values = {
      name: document.getElementById("fruit").value,
      url: document.getElementById("imgUrl").value,
      id: document.getElementById("hiddenId").value,
    };

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0]; // Obtener el archivo seleccionado

    /* if (!file) {
      console.error("No se ha seleccionado ningún archivo.");
      return;
    } */

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("url", values.url);
    formData.append("id", values.id);
    formData.append("file", file);

    const url =
      this.edit === false
        ? "/test_desarrollo/server/addItem.php"
        : "/test_desarrollo/server/editFruit.php";

    this.edit = false;

    const result = await this.sendData(url, formData);
    console.log(result);

    document.getElementById("fruit-form").reset();
    await this.fetchFruit();
  }

  async fetchFruit() {
    try {
      const response = await fetch("/test_desarrollo/server/fruitList.php");
      const fruits = await response.json();
      console.log(fruits);
      let template = "";
      fruits.forEach((fruit) => {
        const { pathImage, url } = fruit;

        const srcPath = !pathImage
          ? url
          : `/test_desarrollo/server/${pathImage}`;

        template += `
          <div class="item" data-id=${fruit.id}>
            <img src="${srcPath}" alt="fruit-photo">
            <span class="text-box">
              <p>${fruit.name}</p>
              <span class="edit au"><i class="bi bi-pencil-square"></i></span>
              <span class="delete au"><i class="bi bi-trash"></i></span>
            </span>
          </div>
        `;
      });
      document.querySelector(".table-list").innerHTML = template;

      const element01 = document.createElement("div");
      const element02 = document.createElement("div");
      element01.className = "element01";
      element02.className = "element02";
      document.querySelector(".table-list").prepend(element01);
      document.querySelector(".table-list").appendChild(element02);

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

  async sendData(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
      });
      return await response.json();
    } catch (error) {
      console.error("Error in postData:", error);
      throw error;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FruitManager();
});
