const loader = document.querySelector(".loader-container");

const loaderToggle = element => {
//   console.log("work");
  const styles = [
    ["left", "-100vw"],
    ["transform", "scale(0.8)"],
    ["transition", ".3s"],
  ];

  styles.forEach(([property, value]) => {
    element.style[property] = value;
  });
};

// Display loader before page ready
document.addEventListener("DOMContentLoaded", () => {
  loaderToggle(loader, 500);
  // console.log("ready");
});
