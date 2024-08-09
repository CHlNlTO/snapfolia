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

  const uploadUrl = url + "/upload"

  xhr.open("POST", uploadUrl, true);

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

      console.log(result);

      if (typeof result === "string") {
        result = JSON.parse(result); // Parse the string to JSON object
        console.log("Parsed Result:", result);
      }

      if (result.leaf_detected === false) {
        console.log("Image does not contain a leaf.");
        alert("Image does not contain a leaf.");
        return;
      }

      const classResult = result.label;
      const probability = (result.confidence.toFixed(2) * 100).toString() + "%";

      if (result.confidence <= .7) {
        console.log("Image quality is low. Please take a photo again.");
        alert("Image quality is low. Please take a photo again.");
        return;
      }

      console.log("Class Result:", classResult);

      document.getElementById("filipino-name").innerHTML = classResult;
      document.getElementById("english-name").innerHTML =
        getEnglishName(classResult);
      document.getElementById("scientific-name").innerHTML =
        getScientificName(classResult);
      document.getElementById("scan-time").innerHTML = `Scan Time: ${timeSpent.toFixed(2)} seconds`;
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
        .getElementById("scan-time")
        .classList.add("animate-fade-in-result");
      document
        .getElementById("probability")
        .classList.add("animate-fade-in-result");

      const treeUrl = "./static/trees/" + getURL(classResult) + ".html";

      fetch(treeUrl)
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("tree-div").innerHTML = data;
        });
    } else {
      console.log("Error:", xhr.statusText);
    }

    console.log("Start Test");

    sendScanTime(timeSpent);

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

function sendScanTime(time){
  console.log("Testing");
  const xhr = new XMLHttpRequest();
  const timeUrl = url + "/scan-time"

  xhr.open("POST", timeUrl, true);
  
  const formData = new FormData();
  
  const scanTime = time.toFixed(2);
  formData.append("time", scanTime);

  xhr.onload = function () {
    if (xhr.status === 200) {
      let result = xhr.responseText;

      result = JSON.parse(result);
      console.log(result);
    }
  }

  xhr.send(formData);
  
  console.log("Testing done");
}

function scan_again() {
  // Reset upload progress bar
  const progressBar = document.getElementById("upload-progress");
  progressBar.value = 0;
  progressBar.classList.add("d-none");

  // Show 'Scan Leaf' button and hide 'Scan Again' button
  const btn_scan = document.getElementById("btn-scan");
  const btn_scan_again = document.getElementById("btn-scan-again");
  const btn_cancel = document.getElementById("btn-cancel");
  btn_scan.style.display = "block";
  btn_scan_again.style.display = "none";
  btn_cancel.style.display = "none";

  // Clear any displayed results
  document.getElementById("filipino-name").innerHTML = "Filipino Name";
  document.getElementById("english-name").innerHTML = "English Name";
  document.getElementById("scientific-name").innerHTML = "Scientific Name";
  document.getElementById("scan-time").innerHTML = "Scan Time: Not Yet Scanned";
  document.getElementById("probability").innerHTML = "Probability";

  // Clear any displayed image or iframe content
  var imgBox = document.getElementById("imgBox");
  var btn_upload = document.getElementById("btn-upload");
  var fa_image = document.getElementById("fa-image");
  imgBox.style.display = null;
  imgBox.style.backgroundImage = null;
  btn_upload.style.display = "block";
  fa_image.style.display = "block";

  fetch("./static/trees/tree_div.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("tree-div").innerHTML = data;
    });

  // Remove fade-in animation classes
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
    .getElementById("scan-time")
    .classList.remove("animate-fade-in-result");
  document
    .getElementById("probability")
    .classList.remove("animate-fade-in-result");

  // Reset file input element
  const fileInput = document.getElementById("file");
  fileInput.value = ""; // Clear selected file

  // Reset capture input element
  const captureInput = document.getElementById("capture");
  captureInput.value = ""; // Clear selected capture file

  // Scroll to top of page
  window.scrollTo(0, 0);
}