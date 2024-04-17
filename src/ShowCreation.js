import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class ShowCreation extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      TaskName: '',
      User: props.login,
      TaskDate: props.date,
      Periodicity: 'month',
      Weight: '',
      Criteria: '',
      Note: '',
      SMARTTask: '',
      Base: '',
      BaseGUID: '',
      Permissions: props.Permissions,
      tasks: props.tasks
    };

    this.state = this.initialState;
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    const { name, value } = event.target;
    let id;

    if (event.target.id === 'Base') {
      id = event.target[event.target.selectedIndex].id;
    }

    if (name === 'Weight') {
      if (Number.isInteger(Number(value))) {
        if (value.length < 8) {
          if (((Number(value) >= 0 && this.state.Periodicity === 'year') || (Number(value) > 0)) || !value) {
            this.setState({
              [name]: value
            });
          } else {
            alert('Некорретно введен вес задачи')
          }
        } else {
          alert('Максимальная длина веса 7 символов');
        }
      } else {
        alert('Вводить можно только целочисленные значения!');
        this.setState({
          [name]: this.state.Weight
        });
      }
    } else if (name === 'TaskDate' && this.state.Periodicity === 'year') {
      if (Number.isInteger(Number(value))) {
        if (Number(value) > 0 || !value) {
          this.setState({
            [name]: value
          });
        } else {
          alert('Некорретно введен год')
        }
      } else {
        alert('Вводить можно только целочисленные значения!');
      }
    } else if (name === 'Base') {
      this.setState({
        [name]: value
      });

      this.setState({
        BaseGUID: id
      });

    } else {

      this.setState({
        [name]: value
      });

    }
    if (name === 'Periodicity' && value === 'year') {
      document.getElementById('group-Base').style.display = 'none';
      document.getElementById('group-month').style.display = 'none';
      document.getElementById('group-year').style.display = 'block';
      document.getElementById('group-year').className = 'form-group';
      this.setState({ TaskDate: this.props.date.substr(0, 4) });
    } else if (name === 'Periodicity' && value === 'month') {
      document.getElementById('group-Base').style.display = 'block';
      document.getElementById('group-month').style.display = 'block';
      document.getElementById('group-year').style.display = 'none';
      if (this.props.date.length === 4) {
        let date = this.props.date + '-01';
        this.setState({ TaskDate: date });
      } else {
        this.setState({ TaskDate: this.props.date });
      }
      if (this.state.Weight === '0') {
        this.setState({
          Weight: '1'
        })
      }
    }
  }

  onFormSubmit = () => {
    const { CanChange, AddressAGD, /*DatesChangeBlock,*/ PreviousPeriodChangeBlock, Delegation } = this.props.Permissions;
    // const { StartChangeDateBlock, EndChangeDateBlock } = DatesChangeBlock;
    let { TaskDate, TaskName, Weight, Base, tasks } = this.state;
    let stateDate = TaskDate;
    let nowDate = new Date();
    nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 25);
    if (TaskDate.length === 4) {
      TaskDate = new Date(Number(TaskDate.substr(0, 4)), nowDate.getMonth(), 25);
    } else {
      TaskDate = new Date(Number(TaskDate.substr(0, 4)), Number(TaskDate.substr(5, 2)) - 1, 25);
    }

    //Проверка выбранной периодичности
    //Создание цели на месяц
    if (this.state.Periodicity === 'month') {

      //Проверка заполненности обязательных полей
      if (!this.checkInput(stateDate) || !this.checkInput(TaskName) || !this.checkInput(Weight) || !this.checkInput(Base)) {
        alert('Не заполнены обязательные поля!');
        return;
      }

      //Цель создается на текущий период
      if (nowDate.getTime() === TaskDate.getTime()) {

        //Проверка на возможность создания нескольких целей по одной годовой
        if (!Delegation) {

          for (let task of tasks) {
            if (task.Base === Base) {
              alert('В данном месяце уже есть связанные с годовой целью задачи. Делегировать в один месяц более одной задачи от одного основания не допкускается');
              return;
            } else {
              continue;
            }
          }

        }

        //Проверка возможности создания цели на текущий период
        if (CanChange) {
          this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
          alert('Цель создана');
          this.clearFields();
        } else {
          alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`);
          return;
        }

        //Цель создается на прошедший период
      } else if (nowDate.getTime() > TaskDate.getTime()) {

        //Проверка возможности создания цели на прошедший период
        if (!PreviousPeriodChangeBlock) {

          //Проверка на возможность создания нескольких целей по одной годовой
          if (!Delegation) {

            for (let task of tasks) {
              if (task.Base === Base) {
                alert('В данном месяце уже есть связанные с годовой целью задачи. Делегировать в один месяц более одной задачи от одного основания не допкускается');
                return;
              } else {
                continue;
              }
            }

          }

          this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
          alert('Цель создана');
          this.clearFields();
        } else {
          alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`);
          return;
        }

        //Цель создается на будущий период
      } else {

        //Проверка на возможность создания нескольких целей по одной годовой
        if (!Delegation) {

          for (let task of tasks) {
            if (task.Base === Base) {
              alert('В данном месяце уже есть связанные с годовой целью задачи. Делегировать в один месяц более одной задачи от одного основания не допкускается');
              return;
            } else {
              continue;
            }
          }

        }

        this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
        alert('Цель создана');
        this.clearFields();
      }

      //Создание годовой цели
    } else if (this.state.Periodicity === 'year') {

      //Проверка заполненности обязательных полей
      if (!this.checkInput(stateDate) || !this.checkInput(TaskName)) {
        alert('Не заполнены обязательные поля!');
        return;
      }

      //Цель создается на прошедший период
      if (nowDate.getFullYear() > TaskDate.getFullYear()) {

        //Проверка возможности создания цели на прошедший период
        if (PreviousPeriodChangeBlock) {
          alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`);
          return;
        } else {
          this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
          alert('Цель создана');
          this.clearFields();
        }

        //Цель создается на текущий или будущий период
      } else {
        this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
        alert('Цель создана');
        this.clearFields();
      }

      //Если у цели не заполнена периодичность
    } else {
      alert('Нужно выбрать периодичность');
    }

  }

  //Очистка полей для последующего создания целей
  clearFields() {
    this.setState({ TaskName: '' });
    this.setState({ Weight: '' });
  }

  //проверка ввода пустого значения
  checkInput(text_from_input) {
    return /[^\s]/gim.test(text_from_input);
  }

  changeDate(date) {
    if (date < 10) {
      date = '0' + date
    }
    return date;
  }

  valueList() {
    const { yearTasks } = this.props;
    const option = yearTasks.map((element) => {
      return (
        <option value={element.TaskName} id={element.GUID} >{element.TaskName}</option>
      )
    })
    return (
      <select onChange={this.handleChange} name='Base' className="form-select" id='Base' >
        <option value='' id='' >Выберите годовую цель</option>
        {option}
      </select>
    );
  }

  render() {
    const { TaskName, TaskDate, Weight, Criteria, Note } = this.state;

    if (TaskDate.length === 4 && !this.state.Periodicity) {
      this.setState({ TaskDate: TaskDate + '-01' })
    }

    return (
      <div>
        <div className="form-group">
          <label htmlFor='TaskName' className="col-sm-8 col-form-label">Наименование задачи*</label>
          <div className="col-sm-0">
            <textarea value={TaskName} onChange={this.handleChange} type="text" name='TaskName' className="form-control" placeholder="Наименование" id="TaskName"></textarea>
          </div>
        </div>

        <div className="form-group" >
          <label htmlFor='Weight' className="col-sm-4 col-form-label">Вес*</label>
          <div className="col-sm-0">
            <input value={Weight} onChange={this.handleChange} type="number" name='Weight' className="form-control" id="Weight" placeholder="Число" />
          </div>
        </div>

        <div className='form-group'>
          <label>Периодичность*</label>
          <div className='col-sm-0'>
            <select onChange={this.handleChange} name='Periodicity' className="form-select" id='Periodicity'>
              <option value='month'>Месяц</option>
              <option value='year'>Год</option>
            </select>
          </div>
        </div>

        <div id='group-month' className="form-group">
          <label htmlFor='TaskDate' className="col-sm-2 col-form-label">Месяц*</label>
          <div className="col-sm-0">
            <input value={TaskDate} onChange={this.handleChange} type="month" name='TaskDate' className="form-control" id="TaskDate" placeholder="Дата" />
          </div>
        </div>

        <div id='group-year' className={"d-none form-group"} >
          <label htmlFor='TaskDate' className="col-sm-2 col-form-label">Год*</label>
          <div className="col-sm-0">
            <input value={TaskDate} onChange={this.handleChange} type="number" name='TaskDate' className="form-control" id="TaskDate" placeholder="Дата" />
          </div>
        </div>

        <div id='group-year' className="form-group" >
          <label htmlFor='Criteria' className="col-sm-3 col-form-label">Критерии выполнения</label>
          <div className="col-sm-0">
            <textarea value={Criteria} onChange={this.handleChange} name='Criteria' className="form-control" id="Criteria" placeholder="Список критериев" ></textarea>
          </div>
        </div>

        <div id='group-year' className="form-group" >
          <label htmlFor='Note' className="col-sm-3 col-form-label">Комментарий (Отчет)</label>
          <div className="col-sm-0">
            <input value={Note} onChange={this.handleChange} type="text" name='Note' className="form-control" id="Note" placeholder="Комментарий" />
          </div>
        </div>

        <div id='group-Base' className="form-group">
          <label htmlFor='Base' className="col-sm-4 col-form-label">Годовая цель*</label>
          <div className="col-sm-0">
            {this.valueList()}
          </div>
        </div>
        <div>
          <Button className='btn btn-primary mt-2' id='create' onClick={this.onFormSubmit}>Создать</Button>
        </div>
      </div>
    );
  }
}

export default ShowCreation;