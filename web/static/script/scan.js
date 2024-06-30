function scan() {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (file === undefined) {
    alert("No image attached.");
    return;
  }

  progressBar.classList.remove("d-none");
  btn_scan.style.display = "none";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", model);

  const xhr = new XMLHttpRequest();

  // Track progress
  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 50;
      progressBar.value = percentComplete;
    }
  };

  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = 50 + (event.loaded / event.total) * 50;
      progressBar.value = percentComplete;

      if (percentComplete == 100) {
        btn_scan.style.display = "none";
        btn_scan_again.style.display = "block";
        progressBar.classList.add("d-none");
      }
    }
  };

  xhr.open("POST", url, true);

  // Handle the response
  xhr.onload = function () {
    if (xhr.status === 200) {
      // == success: function(result, status)
      let result = xhr.responseText;

      console.log("MODEL:", model);
      console.log(result);

      if (typeof result === "string") {
        result = JSON.parse(result); // Parse the string to JSON object
        console.log("Parsed Result:", result);
      }

      if (result.results.length === 0) {
        console.log("Image does not contain a leaf.");
        alert("Image does not contain a leaf.");
        return;
      }

      // if (result.results[0].confidence <= 1.0) {
      //   console.log("Result lower than expected. Please try again.");
      //   alert("Result lower than expected. Please try again.");
      //   return;
      // }

      // Accessing the prediction value
      const classResult = result.results[0].label;

      const probability =
        (result.results[0].confidence.toFixed(2) * 100).toString() + "%";

      // Printing the value
      console.log("Class Result:", classResult);

      // Display the Filipino name (class)
      document.getElementById("filipino-name").innerHTML = classResult;

      // Update the corresponding HTML elements with class probabilities
      document.getElementById("english-name").innerHTML =
        getEnglishName(classResult);
      document.getElementById("scientific-name").innerHTML =
        getScientificName(classResult);
      document.getElementById("probability").innerHTML = probability;

      // Add fade-in animation
      document
        .getElementById("filipino-name")
        .classList.add("animate-fade-in-result");
      document
        .getElementById("english-name")
        .classList.add("animate-fade-in-result");
      document
        .getElementById("scientific-name")
        .classList.add("animate-fade-in-result");
      document
        .getElementById("probability")
        .classList.add("animate-fade-in-result");

      // Trigger the marker filtering based on the Filipino name
      filterMarkers(classResult.toLowerCase());

      // Construct the Wikipedia URL based on the classResult
      const treeUrl = "./static/trees/" + getURL(classResult) + ".html";

      // Set the src attribute of the iframe to the constructed Wikipedia URL
      fetch(treeUrl)
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("tree-div").innerHTML = data;
        });
    } else {
      console.log("Error:", xhr.statusText);
    }
  };

  xhr.send(formData);

  xhr.onerror = function () {
    console.log("Error:", xhr.statusText);

    if (xhr.status === 0 && xhr.statusText === "") {
      alert(
        "Network error: Connection refused. Please check your internet connection or server availability."
      );
      progressBar.classList.add("d-none");
      btn_scan.style.display = "none";
      btn_scan_again.style.display = "block";
    }
  };
}

function scan_again() {
  imgBox.style.display = null;
  imgBox.style.backgroundImage = null;
  fa_image.style.display = "block";
  btn_capture.style.display = "block";
  input_capture.value = null;
  btn_upload.style.display = "block";
  input_upload.value = null;
  progressBar.classList.add("d-none");

  fetch("./static/trees/tree_div.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("tree-div").innerHTML = data;
    });

  document.getElementById("upload-progress").value = 0;
  document.getElementById("filipino-name").innerHTML = "Filipino Name";
  document.getElementById("english-name").innerHTML = "English Name";
  document.getElementById("scientific-name").innerHTML = "Scientific Name";
  document.getElementById("probability").innerHTML = "Probability";

  document
    .getElementById("filipino-name")
    .classList.remove("animate-fade-in-result");
  document
    .getElementById("english-name")
    .classList.remove("animate-fade-in-result");
  document
    .getElementById("scientific-name")
    .classList.remove("animate-fade-in-result");
  document
    .getElementById("probability")
    .classList.remove("animate-fade-in-result");

  btn_scan_again.style.display = "none";
}
