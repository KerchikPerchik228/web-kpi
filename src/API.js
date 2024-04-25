import React, { Component } from 'react';
import ToolBar from './ToolBar';
import ModalTask from './ModalTask';
import ModalWarning from './ModalWarning';

class API extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      tasks: [],
      error: null,
      total: [],
      showFullForm: false,
      showCreateForm: false,
      fullTask: {},
      yearTasks: [],
      showWarningForm: false,
      Permissions: {}
    };
    this.changeState = this.changeState.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.componentDelete = this.componentDelete.bind(this);
    this.fillYearTasks = this.fillYearTasks.bind(this);
    this.component = this.component.bind(this);
    this.openWarningForm = this.openWarningForm.bind(this);
  };

  changeState(tasks, isLoaded, error = null) {
    this.setState({ tasks: tasks });
    this.setState({ isLoaded: isLoaded });
    this.setState({ error: error });
  }

  async componentDidMount() {
    this.props.getListTasks(this.props.login, this.props.date, this.fillYearTasks, this.changeState);
  }

  check = (task) => {
    const { CanChange, /*DatesChangeBlock,*/ PreviousPeriodChangeBlock } = this.state.Permissions;
    let TaskDate = task.Date;
    // const { StartChangeDateBlock, EndChangeDateBlock } = DatesChangeBlock;
    let nowDate = new Date();
    nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 25);
    if (TaskDate.length === 4) {
      TaskDate = new Date(Number(TaskDate.substr(6, 4)), nowDate.getMonth(), 25);
    } else {
      TaskDate = new Date(Number(TaskDate.substr(6, 4)), Number(TaskDate.substr(3, 2)) - 1, 25);
    }

    if (task.Periodicity === 'Месяц') {

      if (nowDate.getMonth() === TaskDate.getMonth()) {

        if (CanChange) {
          return true;
        } else {
          return false;
        }

      } else if (nowDate.getMonth() > TaskDate.getMonth()) {

        if (PreviousPeriodChangeBlock) {
          return false;
        } else {
          return true;
        }

      } else {
        return true;
      }

    } else if (task.Periodicity === 'Год') {

      if (nowDate.getFullYear() > TaskDate.getFullYear()) {

        if (PreviousPeriodChangeBlock) {
          return false;
        } else {
          return true;
        }

      } else {
        return true;
      }

    }

  }

  removeTasks = (task, tasks, login) => {
    //Проверка на возможность удаления цели
    if (!this.check(task)) {
      alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${this.state.Permissions.AddressAGD}`)
      return;
    }

    if (window.confirm(`Удалить цель "${task.TaskName}"?`)) {
      if (!task.Approved) {
        this.componentDelete(task.GUID, task.Date, login);
        if (tasks === this.state.tasks) {
          this.setState({
            tasks: this.state.tasks.filter((value) => {
              return value !== task
            })
          })
        } else {
          tasks = tasks.filter((value) => {
            return value !== task
          });
        }
      } else {
        alert('Невозможно удалить задачу, если она утверждена!')
      }
    }
  }

  async deleteTask(url, data) {
    const responce = await fetch(url, {
      method: 'POST',
      body: data,
    })

    if (!responce.ok) {
      throw new Error(`Ошибка по адресу ${url}, статус ошибки: ${responce.status}`);
    }
    return responce.body;
  }

componentDelete(task, TaskDate, login) {
    const Delete = {
      'TaskDate': TaskDate,
      'Delete'  : task
    }
    const method = 'task/delete';
    this.component(Delete, login, this.props.date, this.props.getListTasks, method);
  }

  POSTUser(task) {
    task.Done = !task.Done;
    task = {
      // User: task.User,
      Done: task.Done,
      GUID: task.GUID,
      TaskName: task.TaskName
    }
    let method = 'task/state';
    this.component(task, this.props.login, this.props.date, this.props.getListTasks, method);
    let row = document.getElementById(task.TaskName);
    if (task.Done) {
      row.className = 'table-warning';
    } else {
      row.className = 'table-danger';
    }
  }

  sendData(url, data) {
    let arr = document.cookie.split('='), token;

    for (let i in arr) {
      if (arr[i].includes('token')) {
        let arrToken = arr[Number(i) + 1].split(';');
        token = arrToken['0'];
      }
    }

    fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'Authentification': token
      }
    });
  }

  component(task, login, date, getListTasks, method = 'task') {
    // const url = `http://10.50.1.59:90/kpi-web-http-services/hs/POSTTasks/task/${login}`;
    const url = `http://10.50.1.59:90/kpi-web-http-services/hs/POSTTasks/${method}/${login}`;
    // const url = `http://10.50.1.38:90/KMukhachev-kpi-test6/hs/POSTTasks/${method}/${login}`;
    delete task.tasks;
    let data = JSON.stringify(task);
    this.sendData(url, data);
    setTimeout(getListTasks, 1500, login, date, this.fillYearTasks, this.changeState);
  }

  openModalCreate = () => {
    this.setState({ showCreateForm: true });
  }

  openModal = task => {
    this.setState({ fullTask: task });
    this.setState({ showFullForm: true });
  }

  closeModal = () => {
    this.setState({ showFullForm: false });
    this.setState({ showCreateForm: false });
    this.setState({ showWarningForm: false });
  }

  openWarningForm = () => {
    this.setState({ showWarningForm: true });
  }

  fillYearTasks = (tasks) => {
    this.setState({ yearTasks: tasks });
  }

  refreshTable(getListTasks, login, date, fillYearTasks, changeState) {
    getListTasks(login, date, fillYearTasks, changeState);
  }

  setValue(task) {
    if (task !== undefined) {
      let Permissions = task.Permissions;
      this.setState({ Permissions: Permissions })
      return true;
    }
    return false;
  }

  render() {
    const { error, isLoaded, tasks } = this.state;
    let total = [];
    for (let i = 0; i < 5; i++) {
      total[i] = 0;
    }
    if (error) {
      return <div>Ошибка: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Загрузка...</div>
    } else {
      let rows, rulesCompleted = false;
      const { Permissions } = this.state;
      if (tasks.length >= 1 && tasks[0].TaskName !== undefined) {
        rows = tasks.map((row) => {

          //Установка правил
          if (!rulesCompleted && Object.keys(Permissions).length === 0) {
            rulesCompleted = this.setValue(row);
          }

          total[0] += Number(row.Weight);
          let approved, done, verified, className, disabled;
          if (row.Approved) {
            className = 'table-danger';
            approved = true;
            disabled = false;
            total[1]++;
          } else {
            disabled = true;
            approved = false;
          }
          if (row.Done) {
            className = 'table-warning';
            done = true;
            total[2]++;
          } else {
            done = false;
          }
          if (row.Verified) {
            className = 'table-success';
            verified = true;
            disabled = true;
            total[3]++;
            total[4] += Number(row.Weight);
          } else {
            verified = false;
          }
          return (
            <tr id={row.TaskName} key={row.GUID} className={className}>
              <td id='row-TaskName' className='text-break' onClick={() => this.openModal(row)}>{row.TaskName}</td>
              <td id='row-Date' onClick={() => this.openModal(row)}>{row.Date}</td>
              <td id='row-Weight' className='weight' onClick={() => this.openModal(row)}>{row.Weight}</td>
              <td>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id={'Approved-' + row.GUID} checked={approved} disabled={true} />
                </div>
              </td>
              <td>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id={"Done-" + row.GUID} checked={done} disabled={disabled} onChange={() => this.POSTUser(row)} />
                </div>
              </td>
              <td>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id={"Verified-" + row.GUID} checked={verified} disabled={true} />
                </div>
              </td>
              <td id='row-Base' onClick={() => this.openModal(row)}>{row.Base}</td>
              <td>
                <svg id='markForDelete' onClick={() => this.removeTasks(row, tasks, this.props.login)} xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </td>
            </tr>
          )
        })
      } else {
        let task = tasks[0];
        if (!rulesCompleted && Object.keys(Permissions).length === 0) {
          rulesCompleted = this.setValue(task);
        }
      }
      if (JSON.stringify(this.state.total) !== JSON.stringify(total)) {
        this.setState({ total: total });
      }
      return (
        <div>
          <div className="row">
            {/* Панель инструментов */}
            <ToolBar
              date={this.props.date}
              openModalCreate={this.openModalCreate}
              changePeriod={this.props.changePeriod}
              fillYearTasks={this.fillYearTasks}
              changeState={this.changeState}
              login={this.props.login}
              getListTasks={this.props.getListTasks}
              show={this.state.showCreateForm}
              closeModal={this.closeModal}
              yearTasks={this.state.yearTasks}
              component={this.component}
              refreshTable={this.refreshTable}
              Permissions={this.state.Permissions}
              showWarningForm={this.state.showWarningForm}
              openWarningForm={this.openWarningForm}
              tasks={this.state.tasks}
            />
            {/* Открытие формы задачи  */}
            <ModalTask
              show={this.state.showFullForm}
              onHide={this.closeModal}
              task={this.state.fullTask}
              login={this.props.login}
              component={this.component}
              date={this.props.date}
              getListTasks={this.props.getListTasks}
              Permissions={this.state.Permissions}
            />
            {/* Открытие предупреждения */}
            <ModalWarning
              showWarningForm={this.state.showWarningForm}
              onHide={this.closeModal}
              Permissions={this.state.Permissions}
            />
          </div>
          <table id='table' className='table table-light table-bordered'>
            <thead>
              <tr>
                <th className='text-center align-middle col-5' scope='col'>Задача</th>
                <th className='text-center align-middle' scope='col'>Срок</th>
                <th className='text-center align-middle' scope='col'>Вес</th>
                <th className='text-center align-middle' scope='col'>Утв</th>
                <th className='text-center align-middle' scope='col'>Вып</th>
                <th className='text-center align-middle' scope='col'>Пров</th>
                <th className='text-center align-middle' scope='col'>Основание</th>
                <th className='text-center align-middle' scope='col'></th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td>{this.state.total[0]}</td>
                <td>{this.state.total[1]}/{this.state.tasks.length}</td>
                <td>{this.state.total[2]}/{this.state.tasks.length}</td>
                <td>{this.state.total[3]}/{this.state.tasks.length}</td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <div>
            Вам закрыли: {total[4]}%
          </div>
        </div>
      )
    }
  }
}
export default API;
