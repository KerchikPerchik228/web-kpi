import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';

class ShowTaskChange extends Component {
  render() {
    const { show, onHide, note } = this.props;

    return (
      <div>
        <Modal className='modal-dialog modal-sm-down' show={show} onHide={onHide} centered size='lg'>
          <Modal.Body>
            <div>

              <div className="form-group">
                <label htmlFor='NameProps' className="col-sm-8 col-form-label">Изменение реквизита</label>
                <div className="col-sm-0">
                  <p className="form-control" id="NameProps">{note.NameProps}</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor='Period' className="col-sm-8 col-form-label">Период</label>
                <div className="col-sm-0">
                  <p className="form-control" id="Period">{note.Period}</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor='Change' className="col-sm-8 col-form-label">Изменение</label>
                <div className="col-sm-0">
                  <textarea disabled className="form-control" id="Change">{note.Change}</textarea>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor='Responsible' className="col-sm-8 col-form-label">Ответственный</label>
                <div className="col-sm-0">
                  <p className="form-control" id="Responsible">{note.Responsible}</p>
                </div>
              </div>

            </div>
          </Modal.Body>
        </Modal>
      </div >
    )
  }
}

export default ShowTaskChange