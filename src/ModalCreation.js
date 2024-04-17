import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import ShowCreation from './ShowCreation'

class ModalCreation extends Component {
  render() {
    const { show, closeModal, yearTasks, getListTasks, date, fillYearTasks, changeState, login, Permissions, component, tasks } = this.props;

    return (
      <div>
        <Modal show={show} onHide={closeModal} backdrop='static' centered size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Создание цели</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ShowCreation
              yearTasks={yearTasks}
              getListTasks={getListTasks}
              date={date}
              fillYearTasks={fillYearTasks}
              changeState={changeState}
              login={login}
              component={component}
              Permissions={Permissions}
              tasks={tasks}
              show={show}
            />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ModalCreation