import React, { Component } from 'react'
import { Modal } from 'react-bootstrap';

export class ModalWarning extends Component {

	changeDate(date) {
		if (date < 10) {
			date = '0' + date
		}
		return date;
	}

	render() {
		const { showWarningForm, onHide } = this.props;

		return (
			<div>
				<Modal show={showWarningForm} onHide={onHide} size='lg' >
					<Modal.Header closeButton>
						<Modal.Title>Внимание!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Согласно приказу №455 по целям MBO для сотрудников эксплуатации, внесение целей в этом месяце не доступно с {
							'06.' + this.changeDate(new Date().getMonth() + 1) + `.${new Date().getFullYear()}`} 0:00:00 до {
							'25.' + this.changeDate(new Date().getMonth() + 1) + `.${new Date().getFullYear()}`} 0:00:00
					</Modal.Body>
				</Modal>
			</div>
		)

		// let arr = document.cookie.split('='), startDateBlocking, endDateBlocking;

		// if (startDateBlocking !== undefined && endDateBlocking !== undefined) {
		// 	for (let i in arr) {
		// 		if (startDateBlocking === undefined) {
		// 			if (arr[i].includes('startDateBlocking')) {
		// 				let arrStartDate = arr[Number(i) + 1].split(';');
		// 				startDateBlocking = arrStartDate['0'];
		// 				continue;
		// 			}
		// 		}
		// 		if (endDateBlocking === undefined) {
		// 			if (arr[i].includes('endDateBlocking')) {
		// 				let arrEndDate = arr[Number(i) + 1].split(';');
		// 				endDateBlocking = arrEndDate['0'];
		// 				continue;
		// 			}
		// 		}
		// 		if (startDateBlocking && endDateBlocking) {
		// 			break;
		// 		}
		// 	}

		// 	startDateBlocking = startDateBlocking.split('-');
		// 	endDateBlocking = endDateBlocking.split('-');

		// 	return (
		// 		<div>
		// 			<Modal show={showWarningForm} onHide={onHide} size='lg' >
		// 				<Modal.Header closeButton>
		// 					<Modal.Title>Внимание!</Modal.Title>
		// 				</Modal.Header>
		// 				<Modal.Body>
		// 					Согласно приказу №455 по целям MBO для сотрудников эксплуатации, внесение целей в этом месяце не доступно с {
		// 						startDateBlocking[2].substring(0, 2) + '.' + startDateBlocking[1] + '.' + startDateBlocking[0]} 0:00:00 до {
		// 						endDateBlocking[2].substring(0, 2) + '.' + endDateBlocking[1] + '.' + endDateBlocking[0]} 0:00:00
		// 				</Modal.Body>
		// 			</Modal>
		// 		</div>
		// 	)
		// }
	}
}

export default ModalWarning