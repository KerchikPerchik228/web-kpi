import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import ShowInfo from './ShowInfo';

export class ModalInfo extends Component {
  render() {
    const { show, close } = this.props;
    return (
      <div>
        <Modal show={show} onHide={close} size='lg' >
          <Modal.Header closeButton>
            <Modal.Title>Информация о системе</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ShowInfo />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ModalInfo