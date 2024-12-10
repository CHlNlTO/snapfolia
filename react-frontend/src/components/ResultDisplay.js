import React, { useEffect } from "react";

function ResultDisplay({ result }) {
  useEffect(() => {
    const tabs = document.querySelectorAll(".nav-link-item");
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        tabs.forEach((otherTab) => {
          otherTab.style.backgroundColor = "#E6EDED";
          otherTab.style.color = "green";
        });
        tab.style.backgroundColor = "white";
        tab.style.color = "#1e5434";
      });
    });
  }, []);

  return (
    <div className="container-fluid p-0" style={{textAlign: "left"}}>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link-item active"
            id="description-tab"
            data-bs-toggle="tab"
            data-bs-target="#description-tab-pane"
            type="button"
            role="tab"
            aria-controls="description-tab-pane"
            aria-selected="true"
            style={{padding: "10px", fontWeight: "bold", borderColor: "transparent", color: "green", backgroundColor: "white"}}
          >
            Description
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link-item"
            id="uses-tab"
            data-bs-toggle="tab"
            data-bs-target="#uses-tab-pane"
            type="button"
            role="tab"
            aria-controls="uses-tab-pane"
            aria-selected="false"
            style={{padding: "10px", fontWeight: "bold", borderColor: "transparent", color: "green"}}
          >
            Uses
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link-item"
            id="folklore-tab"
            data-bs-toggle="tab"
            data-bs-target="#folklore-tab-pane"
            type="button"
            role="tab"
            aria-controls="folklore-tab-pane"
            aria-selected="false"
            style={{padding: "10px", fontWeight: "bold", borderColor: "transparent", color: "green"}}
          >
            Folklore
          </button>
        </li>
      </ul>
      <div
        className="d-flex flex-lg-row flex-column bg-lgreen border-r tree-div overflow-auto p-4 animate-fade-in"
        id="tree"
      >
        <div className="col-lg-8 col-12">
          <h1 className="color-dgreen fw-bold">
            {result.filipinoName}
            <i className="fas fa-leaf color-dgreen ms-2"></i>
          </h1>

          <p className="color-dgreen margin-0">
            <b className="color-dgreen fw-bold">Also known as:</b>
            {result.englishName}
          </p>

          <hr className="color-dgreen me-3" />

          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active display-color"
              id="description-tab-pane"
              role="tabpanel"
              aria-labelledby="description-tab"
              tabIndex="0"
            >
              <h2 className="color-dgreen fw-bold">General Information</h2>
              <p className="color-dgreen ps-2 pe-3">{result.generalInfo}</p>

              <h2 className="color-dgreen fw-bold">Botany</h2>
              <p className="color-dgreen ps-2 pe-3">{result.botany}</p>

              <h2 className="color-dgreen fw-bold">Distribution</h2>
              <ul>
                {result.distribution?.map((dist, key) => (
                  <li key={key} className="color-dgreen">
                    {dist}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="tab-pane fade display-color"
              id="uses-tab-pane"
              role="tabpanel"
              aria-labelledby="uses-tab"
              tabIndex="0"
            >
              <h2 className="color-dgreen fw-bold">Uses</h2>
              <ul>
                {result.uses?.map((use, key) => (
                  <li key={key} className="color-dgreen">
                    {use}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="tab-pane fade display-color"
              id="folklore-tab-pane"
              role="tabpanel"
              aria-labelledby="folklore-tab"
              tabIndex="0"
            >
              <h2 className="color-dgreen fw-bold">Folklore</h2>
              <p className="color-dgreen ps-2 pe-3">
                {result.folklore || "No folklore available."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-12 d-flex justify-content-center align-content-center">
          <img
            className="w-100 tree-img border-r"
            src={result.treeImage}
            alt={result.filipinoName}
            style={{objectFit: "contain"}}
          />
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;
