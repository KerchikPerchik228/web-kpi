import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

class ShowTask extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      TaskName: props.task.TaskName,
      User: props.task.User,
      TaskDate: props.task.Date,
      dateMonth: props.task.Date.substr(6, 4) + '-' + props.task.Date.substr(3, 2),
      dateYear: props.task.Date.substr(6, 4),
      Periodicity: props.task.Periodicity,
      Weight: props.task.Weight,
      Num: props.task.Number,
      SMARTTask: props.task.SMARTTask,
      Criteria: props.task.Criteria,
      Note: props.task.Note,
      Base: props.task.Base,
      Approved: props.task.Approved,
      Done: props.task.Done,
      Verified: props.task.Verified,
      Permissions: props.task.Permissions,
      GUID: props.task.GUID

    };
    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  handleChange = event => {
    const { name, value } = event.target;

    if (name === 'Weight') {
      if (Number.isInteger(Number(value))) {
        if (value.length < 8) {
          if (Number(value) > 0 || !value) {
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
          [name]: this.props.task.Weight
        });
      }
    } else if (name === 'Number') {
      if (Number.isInteger(Number(value))) {
        if (Number(value) > 0 || !value) {
          this.setState({
            [name]: value
          });
        } else {
          alert('Порядковый номер не может быть равен 0');
        }
      } else {
        alert('Вводить можно только целочисленные значения!');
        this.setState({
          [name]: this.props.task.Number
        });
      }
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  saveChanges = () => {
    const { Approved, Done, Verified, TaskName, Weight, Criteria, Periodicity, Num, Note, Permissions } = this.state;
    let { TaskDate } = this.state;
    TaskDate = new Date(Number(TaskDate.substr(6, 4)), Number(TaskDate.substr(3, 2)) - 1, Number(TaskDate.substr(0, 2)));
    const { CanChange, AddressAGD/*, DatesChangeBlock*/, PreviousPeriodChangeBlock } = Permissions;
    // const { StartChangeDateBlock, EndChangeDateBlock } = DatesChangeBlock;
    const currentDate = new Date();

    //Проверка периодичности задачи
    if (Periodicity === 'Месяц') {

      //Проверка, что изменяется цель текущего месяца
      if (currentDate.getMonth() === TaskDate.getMonth()) {

        //Проверка возможности изменения и утвержденности цели
        if (CanChange && !Approved) {
          this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
          alert('Изменения сохранены!');
          return;
        } else {

          //Проверка на то, что изменены были поля Критерии выполнения или Комментарий (Отчет)
          if (!Done && !Verified
            && (TaskName === this.props.task.TaskName) && (Weight === this.props.task.Weight)
            && (Num === this.props.task.Number) && (Note !== this.props.task.Note || Criteria !== this.props.task.Criteria)) {
            this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
            alert('Изменения сохранены!');
            return;
            //Если были изменены прочие поля, тогда вывод исключения
          } else {

            //Вывод нужного сообщения, если цель находится в запрещенном для изменения периоде
            if (!CanChange) {
              alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`);
              return;
              //Вывод сообщения, если цель утвреждена
            } else if (Approved) {
              alert('Невозможно сохранить изменения, т.к. цель утверждена');
              return;
            }

          }

        }

      } else if (currentDate.getMonth() > TaskDate.getMonth()) {

        if (PreviousPeriodChangeBlock) {

          if (!Done && !Verified
            && (TaskName === this.props.task.TaskName) && (Weight === this.props.task.Weight)
            && (Num === this.props.task.Number) && (Note !== this.props.task.Note || Criteria !== this.props.task.Criteria)) {
            this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
            alert('Изменения сохранены!');
            return;
          }

          alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`);
          return;
        } else {

          if (!Approved) {
            this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
            alert('Изменения сохранены!');
            return;
          } else {

            if (!Done && !Verified
              && (TaskName === this.props.task.TaskName) && (Weight === this.props.task.Weight)
              && (Num === this.props.task.Number) && (Note !== this.props.task.Note || Criteria !== this.props.task.Criteria)) {
              this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
              alert('Изменения сохранены!');
              return;
            }

            alert('Невозможно сохранить изменения, т.к. цель утверждена');
            return;
          }
        }

      } else {
        this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
        alert('Изменения сохранены!');
        return;
      }

    } else if (Periodicity === 'Год') {

      if (currentDate.getFullYear() <= TaskDate.getFullYear()) {

        this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
        alert('Изменения сохранены!');
        return;

      } else {

        if (PreviousPeriodChangeBlock) {
          alert(`Период внесения целей завершен, по вопросам предоставления прав на внесение/изменение/удаление целей необходимо направить запрос на почтовый адрес: ${AddressAGD}`);
          return;
        } else {
          this.props.component(this.state, this.props.login, this.props.date, this.props.getListTasks);
          alert('Изменения сохранены!');
          return;
        }

      }

    }

  }

  changeDate(date) {
    if (date < 10) {
      date = '0' + date
    }
    return date;
  }

  checkInput(text_from_input) {
    return /[^\s]/gim.test(text_from_input);
  }

  //19.04.2024 - начало
  openHistoryChanges() {
    alert('Work');
  }
  //19.04.2024 - конец

  showMonthTask(TaskName, Date, Weight, Number, Criteria, Note, Base) {
    return (
      <div>
        <div className="form-group">
          <label htmlFor='TaskName' className="col-sm-8 col-form-label">Наименование задачи</label>
          <div className="col-sm-0">
            <textarea value={TaskName} onChange={this.handleChange} type="text" name='TaskName' className="form-control" placeholder="Наименование" id="TaskName" ></textarea>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Weight' className="col-sm-4 col-form-label">Вес</label>
          <div className="col-sm-0">
            <input value={Weight} onChange={this.handleChange} type="number" name='Weight' className="form-control" id="Weight" placeholder="Число" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Number' className="col-sm-4 col-form-label">Номер задачи</label>
          <div className="col-sm-0">
            <input value={Number} onChange={this.handleChange} type="number" name='Number' className="form-control" id="Number" placeholder="Число" />
          </div>
        </div>

        <div id='group-Date' className="form-group">
          <label htmlFor='Date' className="col-sm-2 col-form-label">Месяц</label>
          <div className="col-sm-0">
            <input value={Date} onChange={this.handleChange} type="month" name='Date' className="form-control" id="Date" placeholder="Число" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Criteria' className="col-sm-2 col-form-label">Критерии выполнения</label>
          <div className="col-sm-0">
            <input value={Criteria} onChange={this.handleChange} type="text" name='Criteria' className="form-control" id="Criteria" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Note' className="col-sm-2 col-form-label">Комментарий (Отчет)</label>
          <div className="col-sm-0">
            <input value={Note} onChange={this.handleChange} type="text" name='Note' className="form-control" id="Note" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Base' className="col-sm-2 col-form-label">Основание</label>
          <div className="col-sm-0">
            <input readOnly value={Base} onChange={this.handleChange} type="text" name='Base' className="form-control" id="Base" />
          </div>
        </div>

        {/* <div class="btn-group-ShowTask"> */}
        <div>
          <button type='button' className="btn btn-primary mt-2" id='save' onClick={this.saveChanges}>Сохранить изменения</button>
        </div>

        {/* <div>
            <button type='button' className="btn btn-link mt-2 mx-2" id='openHistory' onClick={this.openHistoryChanges}>История изменений</button>
          </div>
        </div> */}
      </div>
    )
  }

  showYearTask(TaskName, Date, Weight, Number, Criteria, Note) {
    return (
      <div>
        <div className="form-group">
          <label htmlFor='TaskName' className="col-sm-8 col-form-label">Наименование задачи</label>
          <div className="col-sm-0">
            <textarea value={TaskName} onChange={this.handleChange} type="text" name='TaskName' className="form-control" placeholder="Наименование" id="TaskName"></textarea>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Weight' className="col-sm-4 col-form-label">Вес</label>
          <div className="col-sm-0">
            <input value={Weight} onChange={this.handleChange} type="number" name='Weight' className="form-control" id="Weight" placeholder="Число" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Number' className="col-sm-4 col-form-label">Номер задачи</label>
          <div className="col-sm-0">
            <input value={Number} onChange={this.handleChange} type="number" name='Number' className="form-control" id="Number" placeholder="Число" />
          </div>
        </div>

        <div id='group-Date' className="form-group">
          <label htmlFor='Date' className="col-sm-2 col-form-label">Год</label>
          <div className="col-sm-0">
            <input value={Date} onChange={this.handleChange} type="number" name='Date' className="form-control" id="Date" placeholder="Число" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Criteria' className="col-sm-2 col-form-label">Критерии выполнения</label>
          <div className="col-sm-0">
            <input value={Criteria} onChange={this.handleChange} type="text" name='Criteria' className="form-control" id="Criteria" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor='Note' className="col-sm-2 col-form-label">Комментарий (Отчет)</label>
          <div className="col-sm-0">
            <input value={Note} onChange={this.handleChange} type="text" name='Note' className="form-control" id="Note" />
          </div>
        </div>

        <div>
          <Button className="btn btn-primary mt-2" id='save' onClick={this.saveChanges}>Сохранить изменения</Button>
        </div>
      </div>
    )
  }

  render() {
    const { TaskName, Weight, dateMonth, dateYear, Number, Periodicity, Base, Criteria, Note } = this.state;

    if (Periodicity === 'Месяц') {
      return this.showMonthTask(TaskName, dateMonth, Weight, Number, Criteria, Note, Base);
    } else {
      return this.showYearTask(TaskName, dateYear, Weight, Number, Criteria, Note);
    }

  }
}

export default ShowTask