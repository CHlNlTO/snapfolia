import React from "react";
import { Carousel } from "react-bootstrap";
import "../styles/UserGuide.css";

const UserGuide = () => {
  const getImageUrl = (imageName) =>
    `${process.env.PUBLIC_URL}/assets/img/${imageName}`;

  return (
    <div className="d-flex flex-row overflow-auto p-4 animate-fade-in">
      <div className="w-100">
        <h1 className="color-dgreen fw-bold text-center">
          <i className="fas fa-leaf color-dgreen"></i>
          User Guide
        </h1>
        <hr className="color-dgreen" />

        <div className="d-flex flex-column align-items-center">
          <ol className="px-3 compact-list">
            <li className="color-dgreen">
              Tap <b className="color-dgreen">'Take a photo'</b> or{" "}
              <b className="color-dgreen">'Upload an image'</b> button.
              <ul className="ps-3 compact-list">
              <li className="color-dgreen" style={{ marginRight: '50px' }}>
                  Take/upload an image of a leaf, preferably following{" "}
                  <b className="color-dgreen">this format</b>:
                </li>
              </ul>
              <img
                className="guide-size pb-1 d-md-block d-none mx-auto"
                src={getImageUrl("guide-preferred.png")}
                alt="Preferred"
              />
              <Carousel className="d-md-none d-block mx-auto w-75">
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={getImageUrl("guide-preferred-1.png")}
                    alt="Center"
                  />
                  <Carousel.Caption>
                    <p className="color-dgreen fw-bold">Subject is centered</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={getImageUrl("guide-preferred-2.png")}
                    alt="Properly lit"
                  />
                  <Carousel.Caption>
                    <p className="color-dgreen fw-bold">
                      Subject is properly lit
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={getImageUrl("guide-preferred-3.png")}
                    alt="Clear"
                  />
                  <Carousel.Caption>
                    <p className="color-dgreen fw-bold">Subject is clear</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
              <ul className="ps-3 compact-list">
                <li className="color-dgreen" style={{ marginRight: '60px' }}>
                  Users should <b className="color-dgreen">avoid</b> taking
                  image of the subject like ones below:
                </li>
              </ul>
              <img
                className="guide-size pb-1 d-md-block d-none mx-auto"
                src={getImageUrl("guide-avoid.png")}
                alt="Avoid"
              />
              <Carousel className="d-md-none d-block mx-auto w-75">
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={getImageUrl("guide-avoid-1.png")}
                    alt="Blurred"
                  />
                  <Carousel.Caption>
                    <p className="color-dgreen fw-bold">Subject is blurred</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={getImageUrl("guide-avoid-2.png")}
                    alt="Contains other elements"
                  />
                  <Carousel.Caption>
                    <p className="color-dgreen fw-bold">
                      Contains other elements
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={getImageUrl("guide-avoid-3.png")}
                    alt="Contains other elements"
                  />
                  <Carousel.Caption>
                    <p className="color-dgreen fw-bold">
                      Contains other elements
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
              <ul className="ps-3 compact-list">
                <li className="color-dgreen pb-3">
                  <b className="color-dgreen">Note: </b>This app is limited to
                  classifying <b className="color-dgreen">trees only</b>.
                </li>
              </ul>
            </li>
            <li className="color-dgreen">
              Tap <b className="color-dgreen">'Scan leaf'</b> button.
            </li>
            <li className="color-dgreen">
              Wait for your results! You can infer the progress of your scan by
              looking at the progress bar.
              <img
                className="guide-size pb-1 d-md-block d-none mx-auto"
                src={getImageUrl("guide-progress.png")}
                alt="Track your progress"
              />
              <img
                className="w-75 mb-1 d-md-none d-block mx-auto"
                src={getImageUrl("guide-progress-mobile.png")}
                alt="Track your progress"
              />
            </li>
            <li className="color-dgreen pb-3">
              Use this app as many times as you want by tapping
              <b className="color-dgreen">'Scan Again'</b> button and scan
              another leaf.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
