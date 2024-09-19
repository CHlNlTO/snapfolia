import React from 'react';
import { Modal } from 'react-bootstrap';
import '../styles/Datasets.css';

function LeafModal({ leaf, show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="vertical-alignment-helper">
        <div className="modal-dialog vertical-align-center bg border-r">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title color-dgreen fw-bold" id="exampleModalLabel">
                {leaf.name}
              </h5>
              <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
            </div>
            <img src={leaf.treeImage} className="tree-img-modal border-r mx-auto mt-2" alt={`${leaf.name} Tree`} />
            <div className="modal-body">
              <div className="d-flex flex-row">
                <p className="color-dgreen fw-bold">English Name:</p>
                <p className="color-dgreen"> &nbsp; {leaf.englishName}</p>
              </div>
              <div className="d-flex flex-row">
                <p className="color-dgreen fw-bold">Scientific Name:</p>
                <p className="color-dgreen"> &nbsp; {leaf.scientificName}</p>
              </div>
              <p className="color-dgreen">{leaf.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LeafModal;