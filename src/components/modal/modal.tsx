import React from 'react';
import './modal.css'

export type ModalProps = {
	onClose: () => void;
	open: boolean;
	header: React.ReactElement | string;
}

export const Modal: React.FC<ModalProps> = (props: React.PropsWithChildren<ModalProps>) => {
	if (!props.open) {
		return null;
	}
	return (
		<div>
			<div className="overlay"/>
			<div className="modal-container">
				<div className="modal-header">
					<div className="header-content">{props.header}</div>
					<div className="button" onClick={props.onClose}>&times;</div>
				</div>
				<div className="modal-content">
					{props.children}
				</div>
			</div>
		</div>
	)
}
