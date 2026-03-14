let laptop = document.querySelector(".laptop");
let range = document.querySelector(".range");
let screen = document.querySelector(".screen");

range.addEventListener("change", () => {
  var rangeValue = range.value;

  screen.style.transform = `rotateX(${rangeValue}deg)`;
});
