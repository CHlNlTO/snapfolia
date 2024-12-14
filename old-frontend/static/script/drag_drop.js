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
