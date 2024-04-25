import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';
import ShowTask from './ShowTask';
import ShowTaskHistory from './ShowTaskHistory';

export class ModalTask extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: ''
    }
    this.showHistory = this.showHistory.bind(this);
    this.showBase = this.showBase.bind(this);
  };

  showPage() {
    const { show, task, login, component, date, getListTasks, Permissions } = this.props;
    let active = document.getElementsByClassName('nav-link active');

    if (active.length === 0) {
      if (this.state.page !== 'Base') {
        this.setState({
          page: 'Base'
        });
      }

      return (
        <ShowTask
          login={login}
          task={task}
          component={component}
          date={date}
          show={show}
          getListTasks={getListTasks}
          Permissions={Permissions}
        />
      );
    }

    active = active[0];

    if (active.id === 'nav-base') {
      if (this.state.page !== 'Base') {
        this.setState({
          page: 'Base'
        });
      }

      return (
        <ShowTask
          login={login}
          task={task}
          component={component}
          date={date}
          show={show}
          getListTasks={getListTasks}
          Permissions={Permissions}
        />
      )
    } else if (active.id === 'nav-history') {
      if (this.state.page !== 'History') {
        this.setState({
          page: 'History'
        });
      }

      return (
        <ShowTaskHistory
          login={login}
          task={task}
          date={date}
        />);
    }

  }

  showHistory() {

    let nav_history = document.getElementById('nav-history');
    let nav_base = document.getElementById('nav-base');

    nav_history.className = 'nav-link active';
    nav_base.className = 'nav-link';
    return this.showPage();

  }

  showBase() {

    let nav_history = document.getElementById('nav-history');
    let nav_base = document.getElementById('nav-base');

    nav_base.className = 'nav-link active';
    nav_history.className = 'nav-link';
    return this.showPage();

  }

  render() {
    const { show, onHide, task } = this.props;
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
          <ul className="nav nav-tabs" id='navbar'>

            <li className='nav-item'>
              <p className='nav-link active' id='nav-base' aria-current='page' onClick={this.showBase}>Основное</p>
            </li>

            <li className='nav-item'>
              <p className='nav-link' id='nav-history' aria-current='page' onClick={this.showHistory}>История изменений</p>
            </li>

          </ul>
          <Modal.Body>
            {this.showPage()}
          </Modal.Body>
        </Modal>
      </div >
    )
  }
}

export default ModalTask