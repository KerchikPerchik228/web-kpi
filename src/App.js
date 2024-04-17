import React, { Component } from 'react';
import API from './API';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: String(String(new Date().getFullYear()) + '-' + String(new Date().getMonth() + 1)),
      countOnlineUsers: 0
    };
    this.changePeriod = this.changePeriod.bind(this);
  }

  componentDidMount() {
    sessionStorage.setItem('Auth', true);
    sessionStorage.setItem('login', this.props.login);
  }

  getListTasks(login, date, fillYearTasks, changeState) {
    let periodicityValue, periodicity = document.getElementById('Periodicity');
    if (periodicity === null) {
      periodicityValue = 'month'
    } else {
      periodicityValue = document.getElementById('Periodicity').value;
    }

    // let baseAddress = 'http://10.50.1.59:90/kpi-web-http-services';
    let baseAddress = 'http://10.50.1.38:90/KMukhachev-kpi-test6';

    let arr = document.cookie.split('=');
    let token;

    for (let i in arr) {
      if (arr[i].includes('token')) {
        let arrToken = arr[Number(i)+1].split(';');
        token = arrToken['0'];
      }
    }

    if (periodicityValue === 'month') {

      const url2 = `${baseAddress}/hs/GETTasks/yeartasks/${login}/${date}/`;
      fetch(url2, {
        method: 'GET',
        headers: {
          'Authentification': token
        }
      })
        .then(res => res.json())
        .then(
          result => {
            fillYearTasks(result);
          }
        )

      const url = `${baseAddress}/hs/GETTasks/monthtasks/${login}/${date}/`;

      fetch(url, {
        method: 'GET',
        headers: {
          'Authentification': token
        }
      })
        .then(res => res.json())
        .then(
          result => {
            changeState(result, true, null);
          },
          // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
          // чтобы не перехватывать исключения из ошибок в самих компонентах.
          error => {
            changeState([], false, error);
          }
        )
    } else {
      const url = `${baseAddress}/hs/GETTasks/yeartasks/${login}/${date}/`;

      fetch(url, {
        method: 'GET',
        headers: {
          'Authentification': token
        }
      })
        .then(res => res.json())
        .then(
          result => {
            changeState(result, true, null);
          }
        )
    }
  }

  changeDate(date, number) {
    if (date.length === 4) {
      date = Number(date) + number;
    } else {
      let newMonth = Number(date.substr(5, 2)) + number;
      if (newMonth === 0) {
        let newYear = Number(date.substr(0, 4)) - 1;
        date = newYear + '-12';
      } else if (newMonth === 13) {
        let newYear = Number(date.substr(0, 4)) + 1;
        date = newYear + '-01';
      } else {
        if (String(newMonth).length !== 2) {
          date = date.substr(0, 5) + '0' + newMonth;
        } else {
          date = date.substr(0, 5) + newMonth;
        }
      }
    }
    return date;
  }

  changePeriod(login, date, number, fillYearTasks, changeState) {
    if (date && number) {
      date = this.changeDate(date, number);
      let period = document.getElementById('period');
      period.value = date;
      if (this.state.date !== date) {
        this.setState({ date: date });
      }
      this.getListTasks(login, date, fillYearTasks, changeState);
      return date;
    }
  }

  conclusion(date) {
    return (
      <div className="container">
        <API
          date={date}
          login={this.props.login}
          changePeriod={this.changePeriod}
          getListTasks={this.getListTasks}
        />
      </div>
    )
  }

  render() {
    return (
      this.conclusion(this.state.date)
    )
  }
}

export default App;