import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom/client';
import ModalInfo from './ModalInfo';
import ModalManual from './ModalManual';
import App from './App';

export class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      showInfoForm: false,
      showManualForm: false
    };
  }

  closeModal = () => {
    this.setState({ showInfoForm: false });
    this.setState({ showManualForm: false });
  }

  componentDidMount() {
    if (sessionStorage.Auth) {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        <App login={sessionStorage.login} />
      );
    }
    document.getElementById('info').addEventListener('click', () => {
      this.setState({ showInfoForm: true });
    });
    document.getElementById('manual').addEventListener('click', () => {
      this.setState({ showManualForm: true });
    });
    document.getElementById('logout').addEventListener('click', () => {
      window.location.reload();
      sessionStorage.clear();
    })
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  changeStatePassword() {
    let passwordInput = document.getElementById("password-input");
    let passwordIcon = document.getElementById("password-icon");
    if (passwordInput.type === "password") {
      passwordInput.type = 'text';
      passwordIcon.classList.add('view');
    } else {
      passwordInput.type = "password";
      passwordIcon.classList.remove('view');
    }
  }

  render() {
    const { login, password } = this.state;
    return (
      <div>
        <div className='container'>
          <div>
            <div>
              <div className="container">
                <div className="modal-header">
                  <h5 className="modal-title mb-3">Форма авторизации</h5>
                </div>
                <div className="form-floating mb-3 login">
                  <input type='text' className="form-control" id="login-input" name='login' onChange={this.handleChange} value={login}></input>
                  <label htmlFor="floatingInput">Логин</label>
                </div>
                <div className="form-floating mb-3 password">
                  <span className='password-icon' id='password-icon' onClick={this.changeStatePassword}></span>
                  <input type="password" className="form-control" id="password-input" name='password' onChange={this.handleChange} value={password} onKeyUp={event => {
                    if (event.code === 'Enter') {
                      this.component()
                    }
                  }}></input>
                  <label htmlFor="floatingPassword">Пароль</label>
                </div>
                {/* <div className="form-check remember">
                  <input className="form-check-input" type="checkbox" id="flexCheckDefault" defaultChecked={remember}></input>
                  <label class="form-check-label" htmlFor="flexCheckDefault">Запомнить меня</label>
                </div> */}
                <div className="modal-footer">
                  <Button type="button" onClick={() => this.component()}>Войти</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalInfo
          show={this.state.showInfoForm}
          close={this.closeModal}
        />
        <ModalManual
          show={this.state.showManualForm}
          close={this.closeModal}
        />
      </div>
    )
  }

  async sendData(url, login, password) {
    if (login && password) {
      const data = JSON.stringify({
        'login': login,
        'password': password
      });
      await fetch(url, {
        method: 'POST',
        body: data,
        // headers: {
        //   'Authentification': `${login}:${password}`
        // }
      }).then(function (response) {
        // Проверяем код ответа
        if (!response.ok) {
          // Сервер вернул код ответа за границами диапазона [200, 299]
          return Promise.reject(new Error(
            'Response failed: ' + response.status + ' (' + response.statusText + ')'
          ));
        } else {
          return response.json();
        }
      }).then(function (data) {
        if (data !== false) {
          document.cookie = `token=${data.token};expires=86400`;
          // document.cookie = `startDateBlocking=${data.startDateBlocking}`;
          // document.cookie = `endDateBlocking=${data.endDateBlocking}`;
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(
            <App login={login} />
          );
        } else {
          alert('Идентификация пользователя не выполнена')
        }
      }).catch(function (error) {
        alert(error);
        return Promise.reject(new Error(error));
      });
    }
  }

  component() {
    const { login, password } = this.state;
    const url = `http://10.50.1.59:90/kpi-web-http-services/hs/POSTAuth/user/`;
    // const url = `http://10.50.1.38:90/KMukhachev-kpi-test6/hs/POSTAuth/user/`;
    this.sendData(url, login, password);
  }
}

export default Auth