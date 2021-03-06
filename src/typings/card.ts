export interface Card {
	id: string;
	title: string;
	description: string;
	dateCreated: Date;
}

export interface List {
	id: string;
	title: string;
	cards: Card[];
}

export interface Board {
	lists: List[];
}
