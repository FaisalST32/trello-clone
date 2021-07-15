import { Card, List } from "../typings/card";

export const getAllLists = (): List[] => {
	const storageList: string = window.localStorage.getItem('lists') || '';
	if (!storageList) {
		return [];
	}
	const lists: List[] = JSON.parse(storageList);
	if (lists && lists.length > 0) {
		return lists;
	}
	return []
}

export const addCardItem = (card: Card, listId: string): List[] => {
	const allListItems = getAllLists();
	const affectedList = allListItems.find(list => list.id === listId);
	affectedList?.cards.push(card);
	saveAllLists(allListItems);
	return allListItems;
}

export const addList = (list: List): List[] => {
	const allListItems = getAllLists() || [];
	allListItems.push(list);
	saveAllLists(allListItems);
	return allListItems;
}


export const deleteCard = (cardId: string, listId: string): List[] => {
	const allListItems = getAllLists();
	const listToUpdate = allListItems.find(list => list.id === listId);
	if (!listToUpdate) {
		console.error('cannot find a list with given listId');
		return allListItems;
	}
	const cardToDeleteIndex = listToUpdate.cards.findIndex(card => card.id === cardId);
	if (cardToDeleteIndex < 0) {
		console.error('cannot find a card with given cardId');
		return allListItems;
	}
	listToUpdate.cards.splice(cardToDeleteIndex, 1);
	saveAllLists(allListItems);
	return allListItems;
}

export const deleteList = (listId: string): List[] => {
	const allListItems = getAllLists();
	const listToDeleteIndex = allListItems.findIndex(list => list.id === listId);
	if (listToDeleteIndex < 0) {
		console.error('cannot find a list with given listId');
		return allListItems;
	}
	allListItems.splice(listToDeleteIndex, 1);
	saveAllLists(allListItems);
	return allListItems;
}

export const transferCard = (sourceListId: string, destinationListId: string, sourceCardIndex: number, destinationCardIndex: number) => {
	const allLists = getAllLists();
	const sourceList = allLists.find(list => list.id === sourceListId);
	const destinationList = allLists.find(list => list.id === destinationListId);
	const sourceCard = sourceList?.cards[sourceCardIndex];
	if (!sourceCard) return allLists;
	sourceList?.cards.splice(sourceCardIndex, 1);
	destinationList?.cards.push(sourceCard);
	destinationList?.cards.sort((a, b) => new Date(a.dateCreated) < new Date(b.dateCreated) ? -1 : 1);
	saveAllLists(allLists);
	return allLists;
}

const saveAllLists = (lists: List[]) => {
	window.localStorage.setItem('lists', JSON.stringify(lists));
}




