document.addEventListener("DOMContentLoaded", function () {
  // Get the background color of the body element
  var bodyClasses = document.body.classList;
  var bodyBackgroundColor = "";

  // Check for each class and get the background color
  if (bodyClasses.contains("bg-lgreen")) {
    bodyBackgroundColor = "#E6EDED";
  } else if (bodyClasses.contains("bg")) {
    bodyBackgroundColor = "white";
  }

  fetch("./static/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Set the navbar background color to match the body background color
      document.getElementById("navbar_main").style.backgroundColor =
        bodyBackgroundColor;
    });
});
