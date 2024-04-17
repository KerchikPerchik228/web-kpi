import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import ShowTask from './ShowTask';

export class ModalTask extends Component {

  render() {
    const { show, onHide, task, login, component, date, getListTasks, Permissions } = this.props;
    // const { CanChange, AddressAGD } = Permissions;

    // if (show && !CanChange) { 
    //   alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`)
    // }

    return (
      <div>
        <Modal show={show} onHide={onHide} backdrop='static' centered size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Цель номер: {task.Number}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ShowTask
              login={login}
              task={task}
              component={component}
              date={date}
              show={show}
              getListTasks={getListTasks}
              Permissions={Permissions}
            />
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default ModalTask