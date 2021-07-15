import React from 'react';
import { List } from "../../typings/card";
import { CardItem } from "../card/card";
import './list.css';
import { Draggable } from "react-beautiful-dnd";

export type ListProps = {
	list: List;
	onAddCard: () => void;
	onDeleteList: () => void;
	onDeleteCard: (cardId: string) => void;
}

export const ListItem: React.FC<ListProps> = (props: ListProps) => {
	return (
		<div className="list">
			<div className="list-header">
				<div className="list-title">{props.list.title}</div>
				<div className="button" onClick={props.onDeleteList}>&times;</div>
			</div>
			<div className="list-content">
				<div className="cards-container">
					{props.list.cards.map((card, index) => (
						<Draggable draggableId={card.id} index={index} key={card.id}>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
								>
									<CardItem key={card.id} card={card} onDelete={() => props.onDeleteCard(card.id)}/>
								</div>
							)}
						</Draggable>
					))}
				</div>
				<div className="add-card-button">
					<div className="button" onClick={props.onAddCard}>
						+ Add Card
					</div>
				</div>
			</div>

		</div>
	)
}
