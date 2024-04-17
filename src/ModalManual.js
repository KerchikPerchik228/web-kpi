import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

export class ModalManual extends Component {
	render() {
		const { show, close } = this.props;
		return (
			<div>
				<Modal show={show} onHide={close} size='lg' >
					<Modal.Header closeButton>
						<Modal.Title>MBO. Инструкция по работе с системой</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Система разработана для:<br></br>
						• Для месячных целей<br></br>
						• Для основного места работы<br></br>
						<br></br>
						Порядок внесения целей в систему:<br></br>
						•  Обговорить с руководителем цели и их вес.<br></br>
						•  Сотрудник должен создать цели в системе (годовую, и на её основе месячную) и уведомить руководителя. Общий вес в отчетном периоде должен составлять 100%.<br></br>
						•  Руководитель должен утвердить цели сотрудника в системе 1С.<br></br>
						•  При выполнении целей сотрудник должен поставить галочку о выполнении цели и уведомить руководителя.<br></br>
						•  Руководителю необходимо поставить проверку выполнения цели сотруднику только в том случае, если, по мнению руководителя, сотрудник выполнил цель.<br></br>
					</Modal.Body>
				</Modal>
			</div>
		)
	}
}

export default ModalManual