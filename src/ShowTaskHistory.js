import React, { Component } from 'react'
import ShowTaskChange from './ShowTaskChange';

class ShowTaskHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      notes: [],
      error: null,
      openFormNote: false,
      openNote: {}
    };
  }

  async componentDidMount() {
    this.getTaskHistory(this.props.task.GUID, this.props.login, this.props.date, this.changeState);
  }

  getTaskHistory(GUID, login, date, changeState) {

    let baseAddress = 'http://10.50.1.59:90/kpi-web-http-services';
    // let baseAddress = 'http://10.50.1.38:90/KMukhachev-kpi-test6';

    let arr = document.cookie.split('=');
    let token;

    for (let i in arr) {
      if (arr[i].includes('token')) {
        let arrToken = arr[Number(i) + 1].split(';');
        token = arrToken['0'];
      }
    }

    const url = `${baseAddress}/hs/GETTasks/taskhistory/${login}/${date}/`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authentification': token,
        'accept': GUID
      }
    })
      .then(res => res.json())
      .then(
        result => {
          this.changeState(result, true, null);
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        error => {
          this.changeState([], false, error);
        }
      )

  }

  changeState(notes, isLoaded, error = null) {
    this.setState({ notes: notes });
    this.setState({ isLoaded: isLoaded });
    this.setState({ error: error });
  }

  openModal = note => {
    this.setState({ openNote: note });
    this.setState({ openFormNote: true });
  }

  closeModal = () => {
    this.setState({ openFormNote: false });
    this.setState({ openNote: {} });
  }

  render() {
    const { error, isLoaded, notes } = this.state;

    if (error) {
      return <div>Ошибка: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Загрузка...</div>
    } else {

      let rows;
      if (notes.length >= 1) {

        rows = notes.map((row) => {

          let onClick;

          if (row.ItChange) {
            onClick = () => this.openModal(row);
          } else {
            onClick = () => undefined;
          }

          return (
            <tr id={row.Stage} key={row.Stage}>
              <td id='row-period' onClick={onClick}>{row.Period}</td>
              <td id='row-stage' onClick={onClick}>{row.Stage}</td>
              <td id='row-responsible' onClick={onClick}>{row.Responsible}</td>
            </tr>
          )
        })

      }

      return (
        <div>
          <div>
            <ShowTaskChange
              show={this.state.openFormNote}
              onHide={this.closeModal}
              note={this.state.openNote}
            />
          </div>

          <table id='table-note' className='table table-light table-bordered'>
            <thead>
              <tr>
                <th className='text-center align-middle' scope='col'>Период</th>
                <th className='text-center align-middle' scope='col'>Этап</th>
                <th className='text-center align-middle' scope='col'>Ответственный</th>
              </tr>
            </thead>
            <tbody id='tbody-note'>
              {rows}
            </tbody>
          </table>
        </div>
      )

    }
  }
}

export default ShowTaskHistory