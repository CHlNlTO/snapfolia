//  ----------- STATIC -----------
//  NAVBAR
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

// TREE DIV
fetch("./static/trees/tree_div.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("tree-div").innerHTML = data;
  });

// ----------------------------------------------------------------------------------------------------------

// INITIALIZATION
var btn_capture = document.getElementById("btn-capture");
var input_capture = document.getElementById("capture");
var btn_upload = document.getElementById("btn-upload");
var input_upload = document.getElementById("file");
var fa_image = document.getElementById("fa-image");
var imgBox = document.getElementById("imgBox");
var btn_scan = document.getElementById("btn-scan");
var btn_scan_capture = document.getElementById("btn-scan-capture");
var btn_scan_again = document.getElementById("btn-scan-again");
var progressBar = document.getElementById("upload-progress");

// -------------------- DEV TOOLS, will remove --------------------

const dropdown = document.getElementById("serverDropdown");
const mDropdown = document.getElementById("modelDropdown");
let url = "http://127.0.0.1:5000/upload";
let model;

// $(document).ready(function () {
//   $.getJSON("https://api.ipify.org?format=json", function (data) {
//     const ipAddress = data.ip;
//     $("#gfg").html(ipAddress);

//     // Log the IP address to the console
//     console.log("IP Address:", ipAddress);

//     // Set the default URL based on the IP address
//     const schoolNetworkIP = "58.71.56";

//     if (
//       typeof ipAddress === "string" &&
//       ipAddress.startsWith(schoolNetworkIP)
//     ) {
//       url = "http://172.16.101.123:5000/classify"; // Private FAITH Server
//     } else {
//       url = "http://58.71.56.23:5000/classify"; // Public FAITH Server
//     }

//     console.log(url);
//   });
// });

function setDefaultModel() {
  const defaultOption = mDropdown.options[0];
  model = defaultOption.value;
  console.log(model);
}

function serverDropdown() {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const selectedValue = selectedOption.value;
  url = selectedValue;
  console.log(url);
}

function modelDropdown() {
  const selectedOption = mDropdown.options[mDropdown.selectedIndex];
  const selectedValue = selectedOption.value;
  model = selectedValue;
  console.log(model);
}

// Set the default URL and model when the page loads
// window.addEventListener("DOMContentLoaded", setDefaultUrl);
window.addEventListener("DOMContentLoaded", setDefaultModel);

// Scan Again for Model
{
  function refresh() {
    // Tree Div
    fetch("./static/trees/tree_div.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("tree-div").innerHTML = data;
      });

    // Progress Bar
    document.getElementById("upload-progress").value = 0;

    // Results
    document.getElementById("fname").innerHTML = "Filipino Name";
    document.getElementById("ename").innerHTML = "English Name";
    document.getElementById("sname").innerHTML = "Scientific Name";
    document.getElementById("dom").innerHTML = "Dominant";
    document.getElementById("sec").innerHTML = "Secondary";
    document.getElementById("ter").innerHTML = "Tertiary";
  }

  var btn_model_scan_capture = document.getElementById(
    "btn-model-scan-capture"
  );
  function modelScanAgainCapture() {
    refresh();
    scan();
  }

  var btn_model_scan = document.getElementById("btn-model-scan");
  function modelScanAgain() {
    refresh();
    scan();
  }
}

function scan_capture() {
  const file = input_capture.files[0];
  if (!file) {
    alert("No image attached.");
    return;
  }

  console.log("File selected: ", file.name); // Log file name

  progressBar.classList.remove("d-none");
  btn_scan_capture.style.display = "none";

  const formData = new FormData();
  formData.append("file", file); // Ensure the key matches what the server expects
  formData.append("model", model);

  const axiosConfig = {
    timeout: 300000,
    onUploadProgress: (progressEvent) => {
      progressBar.value = Math.round(
        (progressEvent.loaded * 50) / progressEvent.total
      );
    },
  };

  axios
    .post(url, formData, axiosConfig)
    .then((response) => {
      console.log("Response received: ", response.data);
      handleResponse(response.data);
    })
    .catch((error) => {
      console.error("Error: ", error.message); // Log error
      handleError(error);
    })
    .finally(() => {
      progressBar.classList.add("d-none");
      btn_scan_again.style.display = "block";
    });
}

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

      // Displays scan again if progress complete
      if (percentComplete == 100) {
        btn_scan.style.display = "none";
        btn_scan_again.style.display = "block";
        progressBar.classList.add("d-none");
      }
    }
  };

  // Configure the AJAX request
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

      if (result.results[0].confidence < 70.0) {
        console.log("Result lower than expected. Please try again.");
        alert("Result lower than expected. Please try again.");
        return;
      }

      // Accessing the prediction value
      const classResult = result.results[0].label;

      // Printing the value
      console.log("Class Result:", classResult);

      // Display the Filipino name (class)
      document.getElementById("fname").innerHTML = classResult;

      // const [dom, sec, ter] = result[0].class_probabilities;
      // const [dom1, sec1, ter1] = result[0].class_name_probabilities;

      // // Assign probabilities to variables
      // const domProbability = dom.toFixed(2) + "%";
      // const secProbability = sec.toFixed(2) + "%";
      // const terProbability = ter.toFixed(2) + "%";

      // // Use the assigned probabilities as needed
      // console.log("Dominant Probability:", dom + " - " + domProbability);
      // console.log("Secondary Probability:", sec + " - " + secProbability);
      // console.log("Tertiary Probability:", ter + " - " + terProbability);

      // Add threshold: if below 70%, add alert instead
      // if (dom < 70.0) {
      //   alert("Result lower than expected. Please try again.");
      // }

      // Update the corresponding HTML elements with class probabilities
      // document.getElementById("ename").innerHTML = getEnglishName(classResult);
      // document.getElementById("sname").innerHTML =
      // getScientificName(classResult);
      document.getElementById("dom").innerHTML =
        result.results[0].confidence.toFixed(2) + "%";
      // document.getElementById("sec").innerHTML = secProbability + " \t" + sec1;
      // document.getElementById("ter").innerHTML = terProbability + " \t" + ter1;

      // Add fade-in animation
      document.getElementById("fname").classList.add("animate-fade-in-result");
      document.getElementById("ename").classList.add("animate-fade-in-result");
      document.getElementById("sname").classList.add("animate-fade-in-result");
      document.getElementById("dom").classList.add("animate-fade-in-result");
      document.getElementById("sec").classList.add("animate-fade-in-result");
      document.getElementById("ter").classList.add("animate-fade-in-result");

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

    // Check for network error (ERR_CONNECTION_REFUSED)
    if (xhr.status === 0 && xhr.statusText === "") {
      // Display an alert for network error
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
  console.log("scan_again function called");
  // Image Div
  imgBox.style.display = null;
  imgBox.style.backgroundImage = null;
  fa_image.style.display = "block";
  btn_capture.style.display = "block";
  input_capture.value = null;
  btn_upload.style.display = "block";
  input_upload.value = null;
  progressBar.classList.add("d-none");

  // Tree Div
  fetch("./static/trees/tree_div.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("tree-div").innerHTML = data;
    });

  // Progress Bar
  document.getElementById("upload-progress").value = 0;

  // Results
  document.getElementById("fname").innerHTML = "Filipino Name";
  document.getElementById("ename").innerHTML = "English Name";
  document.getElementById("sname").innerHTML = "Scientific Name";
  document.getElementById("dom").innerHTML = "Dominant";
  document.getElementById("sec").innerHTML = "Secondary";
  document.getElementById("ter").innerHTML = "Tertiary";

  // Remove fade-in animation
  document.getElementById("fname").classList.remove("animate-fade-in-result");
  document.getElementById("ename").classList.remove("animate-fade-in-result");
  document.getElementById("sname").classList.remove("animate-fade-in-result");
  document.getElementById("dom").classList.remove("animate-fade-in-result");
  document.getElementById("sec").classList.remove("animate-fade-in-result");
  document.getElementById("ter").classList.remove("animate-fade-in-result");

  // Buttons
  btn_scan_again.style.display = "none";
  btn_scan.style.display = "block";

  // DEV TOOLS, will remove
  btn_model_scan_capture.style.display = "none";
  btn_model_scan.style.display = "block";
}

function getURL(classResult) {
  const url = {
    Balayong: "balayong",
    Bayabas: "bayabas",
    Betis: "betis",
    Dao: "dao",
    Dita: "dita",
    Guyabano: "guyabano",
    "Ilang-ilang": "ilang-ilang",
    Ipil: "ipil",
    Kalios: "kalios",
    Kamagong: "kamagong",
    Mulawin: "mulawin",
    Narra: "narra",
    Sintores: "sintores",
    Yakal: "yakal",
    //New Datasets
    Amugis: "amugis",
    Banaba: "banaba",
    Bani: "bani",
    Barako: "barako",
    Binunga: "binunga",
    Duhat: "duhat",
    Eucalyptus: "eucalyptus",
    Hinadyong: "hinadyong",
    Lansones: "lansones",
    Madrecacao: "madrecacao",
    Scrambled_Egg: "scrambledegg",
    Talisay: "talisay",
    Tibig: "tibig",
  };

  return url[classResult] || "N/A";
}

function getEnglishName(classResult) {
  const englishNames = {
    Balayong: "Palawan Cherry",
    Bayabas: "Guava",
    Betis: "Madhuca betis",
    Dao: "Pacific Walnut",
    Dita: "Blackboard",
    Guyabano: "Soursop",
    "Ilang-ilang": "Ylang-ylang",
    Ipil: "Ironwood",
    Kalios: "Sandpaper",
    Kamagong: "Mountain persimmon",
    Mulawin: "Small-flower Chaste",
    Narra: "Rosewood",
    Sintores: "Mandarin Orange",
    Yakal: "Yakal",
     //New Datasets
     Amugis: "Amugis",
     Banaba: "Queen's Cape Myrtle",
     Bani: "Pongam",
     Barako: "Liberica Coffee",
     Binunga: "Parasol",
     Duhat: "Malabar Plum",
     Eucalyptus: "Eucalyptus",
     Hinadyong: "Oriental Trema",
     Lansones: "Langsat",
     Madrecacao: "Gliricidia Tree",
     Scrambled_Egg: "Scrambled Egg",
     Talisay: "Indian Almond",
     Tibig: "Sacking Tree",
  };

  return englishNames[classResult] || "N/A"; // Return the English name or "N/A" if not found
}

function getScientificName(classResult) {
  const scientificNames = {
    Balayong: "Cassia nodosa",
    Bayabas: "Psidium guajava",
    Betis: "Azaola betis Blanco",
    Dao: "Averrhoa bilimbi",
    Dita: "Alstonia scholaris",
    Guyabano: "Annona muricata",
    "Ilang-ilang": "Cananga odorata",
    Ipil: "Intsia bijuga",
    Kalios: "Streblus asper",
    Kamagong: "Diospyros montana",
    Mulawin: "Vitex parviflora",
    Narra: "Pterocarpus indicus",
    Sintores: "Citrus reticulata Blanco",
    Yakal: "Shorea astylosa",
    //New Datasets
    Amugis: "Koordersiodendron pinnatum",
    Banaba: "Lagerstroemia speciosa",
    Bani: "Pongamia pinnata",
    Barako: "Coffea liberica",
    Binunga: "Macaranga tanarius",
    Duhat: "Syzygium cumini",
    Eucalyptus: "Eucalyptus globulus",
    Hinadyong: "Trema orientalis",
    Lansones: "Lansium domesticum",
    Madrecacao: "Gliricidia Sepium",
    Scrambled_Egg: "Senna surattensis",
    Talisay: "Terminalia Catappa",
    Tibig: "Ficus nota",
  };

  return scientificNames[classResult] || "N/A"; // Return the scientific name or "N/A" if not found
}

// DROP IMAGE
{
  // Get the drop area element
  const dropArea = document.getElementById("dropArea");

  // Add event listeners for drag events
  dropArea.addEventListener("dragenter", handleDragEnter, false);
  dropArea.addEventListener("dragover", handleDragOver, false);
  dropArea.addEventListener("dragleave", handleDragLeave, false);
  dropArea.addEventListener("drop", handleDrop, false);

  // Prevent the default behavior for drag events
  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Handle the dragenter event
  function handleDragEnter(e) {
    preventDefault(e);
    // Add a class or styling to indicate that the drop area is active
    dropArea.classList.add("dragover");
  }

  // Handle the dragover event
  function handleDragOver(e) {
    preventDefault(e);
    // Add a class or styling to indicate that the drop area is active
    dropArea.classList.add("dragover");
  }

  // Handle the dragleave event
  function handleDragLeave(e) {
    preventDefault(e);
    // Remove the class or styling that indicates the drop area is active
    dropArea.classList.remove("dragover");
  }
}

// OTHER FUNCTIONS
var loadImg = function (event) {
  imgBox.style.display = "block";
  imgBox.style.backgroundImage =
    "url(" + URL.createObjectURL(event.target.files[0]) + ")";
  fa_image.style.display = "none";
  btn_capture.style.display = "none";
  btn_upload.style.display = "none";

  // Show the cancel/remove image button
  document.getElementById("btn-cancel").style.display = "block";
};

var showBtnCap = function () {
  btn_scan_capture.style.display = "block";
  btn_scan.style.display = "none";

  // DEV TOOLS, will remove
  btn_model_scan_capture.style.display = "block";
  btn_model_scan.style.display = "none";
};

var showBtnScan = function () {
  if (
    (btn_scan_capture.style.display = "block") &&
    (btn_scan.style.display = "none")
  ) {
    btn_scan_capture.style.display = "none";
    btn_scan.style.display = "block";
  }
};

var currentFile = null;

// Handle the drop event
function handleDrop(e) {
  preventDefault(e);
  // Remove the class or styling that indicates the drop area is active
  dropArea.classList.remove("dragover");

  // Get the dropped files
  const files = e.dataTransfer.files;

  // Check if any files were dropped
  if (files.length > 0) {
    // Handle the dropped files here, e.g., display the image
    const file = files[0];
    loadImgFromFile(file);
    currentFile = file;
  }
}

function loadImgFromFile(file) {
  const reader = new FileReader();

  // Handle the file load event
  reader.onload = function (event) {
    const imgBox = document.getElementById("imgBox");
    imgBox.style.display = "block";
    imgBox.style.backgroundImage = `url(${event.target.result})`;
  };

  // Read the file as a data URL
  reader.readAsDataURL(file);
}

dev_tools_popup = document.getElementById("dev-tools-popup");

function devOptionsOpen() {
  dev_tools_popup.style.display = "block";
}

function devOptionsClose() {
  dev_tools_popup.style.display = "none";
}

// TOAST (Not used)
{
  function displayToast(message, type) {
    const toastContainer = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    const toastBody = document.createElement("div");
    toastBody.className = "d-flex";

    const toastIcon = document.createElement("i");
    toastIcon.className = "bi me-2";
    if (type === "success") {
      toastIcon.classList.add("bi-check-circle-fill");
    } else if (type === "error") {
      toastIcon.classList.add("bi-exclamation-circle-fill");
    }

    const toastText = document.createElement("div");
    toastText.className = "toast-body";
    toastText.innerText = message;

    toastBody.appendChild(toastIcon);
    toastBody.appendChild(toastText);
    toast.appendChild(toastBody);

    toastContainer.appendChild(toast);

    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
  }

  function showError(message) {
    alert(message);
  }
}

// Cancel/Remove Image
function cancelUpload() {
  console.log("cancelUpload function called");
  // Hide the image box and reset its background
  imgBox.style.display = "none";
  imgBox.style.backgroundImage = "none";

  // Show the upload and capture buttons
  btn_capture.style.display = "block";
  btn_upload.style.display = "block";

  // Hide the scan and cancel buttons
  btn_scan.style.display = "none";
  btn_scan_capture.style.display = "none";
  btn_scan_again.style.display = "none";
  document.getElementById("btn-cancel").style.display = "none";

  // Reset the file input values
  input_capture.value = null;
  input_upload.value = null;

  // Reset the progress bar
  progressBar.classList.add("d-none");
  progressBar.value = 0;

  // Reset the result fields
  document.getElementById("fname").innerHTML = "Filipino Name";
  document.getElementById("ename").innerHTML = "English Name";
  document.getElementById("sname").innerHTML = "Scientific Name";
  document.getElementById("dom").innerHTML = "Dominant";
  document.getElementById("sec").innerHTML = "Secondary";
  document.getElementById("ter").innerHTML = "Tertiary";

  // Reload the tree-div content
  fetch("./static/trees/tree_div.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("tree-div").innerHTML = data;
    });

  // Remove any fade-in animations
  document.getElementById("fname").classList.remove("animate-fade-in-result");
  document.getElementById("ename").classList.remove("animate-fade-in-result");
  document.getElementById("sname").classList.remove("animate-fade-in-result");
  document.getElementById("dom").classList.remove("animate-fade-in-result");
  document.getElementById("sec").classList.remove("animate-fade-in-result");
  document.getElementById("ter").classList.remove("animate-fade-in-result");
}

// SNACKBAR
function showSnackbar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-cancel').addEventListener('click', cancelUpload);
  document.getElementById('btn-scan-again').addEventListener('click', scan_again);
});

// ----------------------------------------------------------------------------------------------------------
