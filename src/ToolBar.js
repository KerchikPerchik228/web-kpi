import React, { Component } from 'react'
import ModalCreation from './ModalCreation';

export class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: ''
    }
    this.statePeriod = this.statePeriod.bind(this)
  }

  changePeriodicity(login, date, fillYearTasks, changeState, getListTasks) {
    if (date.length === 4) {
      getListTasks(login, this.state.date, fillYearTasks, changeState);
    } else {
      getListTasks(login, date, fillYearTasks, changeState);
    }
    let period = document.getElementById('period'), periodicity = document.getElementById('Periodicity');
    if (periodicity.value === 'month') {
      period.type = 'month';
      period.value = this.state.date;
    } else if (periodicity.value === 'year') {
      period.type = 'number';
      period.value = date.substr(0, 4);
    } else {
      period.type = 'month';
      period.value = date;
    }
  }

  statePeriod(getListTasks, login, fillYearTasks, changeState) {
    let value = document.getElementById('period').value;
    getListTasks(login, value, fillYearTasks, changeState);
  }

  render() {
    let { openModalCreate, changePeriod, fillYearTasks, changeState, login, getListTasks, component, refreshTable, Permissions, openWarningForm } = this.props;
    let month, year, date, className;
    month = new Date().getMonth() + 1;
    year = new Date().getFullYear();
    if (String(month).length !== 2) {
      month = '0' + month;
    }
    let period = document.getElementById('period');
    if (period === null) {
      date = year + '-' + month;
      this.setState({ date: date });
    } else {
      if (period.value) {
        date = period.value;
      } else {
        date = this.state.date;
      }
    }

    if (Permissions.CanChange) {
      let dateYear = date.substr(0, 4);
      if (Number(dateYear) === year) {
        let dateMonth = date.substr(5, 2);
        if (Number(dateMonth) === month) {
          let nowDay = new Date().getDate();
          if (nowDay >= 6 && nowDay < 25) {
            className = '';
          } else {
            className = 'd-none';
          }
        } else {
          className = 'd-none';
        }
      } else {
        className = 'd-none';
      }
    } else {
      className = 'd-none';
    }

    return (
      <div>
        <ModalCreation
          show={this.props.show}
          closeModal={this.props.closeModal}
          yearTasks={this.props.yearTasks}
          getListTasks={getListTasks}
          date={date}
          fillYearTasks={fillYearTasks}
          changeState={changeState}
          login={login}
          component={component}
          Permissions={Permissions}
          tasks={this.props.tasks}
          datesChangeBlock={this.props.DatesChangeBlock}
        />
        <div id='form-group' className='form-group'>
          <div className='periodicity-row mb-1'>
            <label htmlFor='Periodicity' id='labelPeriodicity' className="mx-1 col-sm-0 col-form-label">Периодичность:</label>
            <div className="col-sm-0">
              <select className="form-select" id='Periodicity' onChange={() => this.changePeriodicity(login, date, fillYearTasks, changeState, getListTasks)}>
                <option value="month">Месяц</option>
                <option value="year">Год</option>
              </select>
            </div>
          </div>
          <div className='group-row'>
            <svg id='create' onClick={openModalCreate} xmlns="http://www.w3.org/2000/svg" cursor='pointer' width="30" height="36" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>
            <div className='period-row' id='period-row-month'>
              <svg id='arrow-left' onClick={() => date = changePeriod(login, date, -1, fillYearTasks, changeState)} cursor='pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
                <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
              </svg>
              <div className="col-sm-0">
                <input defaultValue={date} onChange={() => this.statePeriod(getListTasks, login, fillYearTasks, changeState)} type='month' className="form-control" id="period" />
              </div>
              <svg id='arrow-right' onClick={() => date = changePeriod(login, date, 1, fillYearTasks, changeState)} cursor='pointer' xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
                <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
              </svg>
            </div>
            <svg id='refresh' cursor='pointer' onClick={() => refreshTable(getListTasks, login, date, fillYearTasks, changeState)} xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-arrow-repeat mx-2" viewBox="0 0 16 16">
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
              <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
            </svg>
            <svg id='warning' cursor='pointer' onClick={() => openWarningForm()} xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className={"bi bi-exclamation-triangle mx-1 " + className} viewBox="0 0 16 16">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
            </svg>
            {/* <svg id='quit' cursor='pointer' onClick={() => window.location.reload()} xmlns="http://www.w3.org/2000/svg" width="30" height="36" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16">
              <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
            </svg> */}
          </div>
        </div>
      </div>
    )
  }
}

export default ToolBar