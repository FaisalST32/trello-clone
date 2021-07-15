import React from 'react';
import { Card } from "../../typings/card";
import './card.css'

export type CardProps = {
	card: Card;
	onDelete: () => void;
}

export const CardItem: React.FC<CardProps> = (props: CardProps) => {
	return (<div className="card">
		<div className="card-header">
			<div className="button" onClick={props.onDelete}>&times;</div>
		</div>
		<div className="card-title">{props.card.title}</div>
		<div className="card-description">{props.card.description}</div>
	</div>)
}
