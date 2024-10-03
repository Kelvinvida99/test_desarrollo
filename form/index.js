// variables

const inputFruit = document.querySelector("#fruit");
const inputImg = document.querySelector("#imgUrl");
const submitBtn = document.querySelector(".btn");
const textAlert = document.querySelectorAll(".alert");
const tableList = document.querySelector(".table-list");

submitBtn.addEventListener("click", submitEvent);

class ValidateInputs {
  getValues() {
    if (!inputFruit.value) {
      textAlert[0].style.visibility = "visible";
      setTimeout(() => {
        textAlert[0].style.visibility = "hidden";
      }, 3000);
      return;
    }

    if (!inputImg.value) {
      textAlert[1].style.visibility = "visible";
      setTimeout(() => {
        textAlert[1].style.visibility = "hidden";
      }, 3000);
      return;
    }

    setTimeout(() => {
      textAlert[0].style.visibility = "hidden";
      textAlert[1].style.visibility = "hidden";
    }, 3000);

    const newValues = {
      fruitName: inputFruit.value,
      imgUrl: inputImg.value,
    };

    inputFruit.value = "";
    inputImg.value = "";

    this.renderItem(newValues);
  }

  renderItem({ fruitName, imgUrl }) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src=${imgUrl} alt="fruit-photo" />
      <span class="text-box"><p>${fruitName}</p></span>
    `;

    tableList.appendChild(div);

    console.log(div);
  }
}

const execute = new ValidateInputs();

function submitEvent(e) {
  e.preventDefault();
  execute.getValues();
}
