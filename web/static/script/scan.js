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

  // Start time
  const startTime = performance.now();

  // Handle the response
  xhr.onload = function () {
    // End time
    const endTime = performance.now();
    const timeSpent = (endTime - startTime) / 1000; // Convert milliseconds to seconds
    console.log(`Time spent on API call: ${timeSpent.toFixed(2)} seconds`);

    if (xhr.status === 200) {
      let result = xhr.responseText;

      console.log("MODEL:", model);
      console.log(result);

      if (typeof result === "string") {
        result = JSON.parse(result); // Parse the string to JSON object
        console.log("Parsed Result:", result);
      }

      if (result.length === 0) {
        console.log("Image does not contain a leaf.");
        alert("Image does not contain a leaf.");
        return;
      }

      const classResult = result.label;
      const probability = (result.confidence.toFixed(2) * 100).toString() + "%";

      console.log("Class Result:", classResult);

      document.getElementById("filipino-name").innerHTML = classResult;
      document.getElementById("english-name").innerHTML =
        getEnglishName(classResult);
      document.getElementById("scientific-name").innerHTML =
        getScientificName(classResult);
      document.getElementById("probability").innerHTML = probability;

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

      filterMarkers(classResult.toLowerCase());

      const treeUrl = "./static/trees/" + getURL(classResult) + ".html";

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
