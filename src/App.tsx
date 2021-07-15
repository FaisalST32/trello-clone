import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Card, List } from "./typings/card";
import { addCardItem, addList, deleteCard, deleteList, getAllLists, transferCard } from "./services/cards.service";
import { ListItem } from "./components/list/list";
import { Header } from "./components/header";
import { Modal } from "./components/modal/modal";
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";


function App() {
  const [lists, setLists] = useState<List[]>([])
  const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
  const [isAddingList, setIsAddingList] = useState<boolean>(false);
  const [cardBeingAdded, setCardBeingAdded] = useState<{listId: string, card: Card}>({} as {listId: string, card: Card})
  const [listBeingAdded, setListBeingAdded] = useState<List>({} as List);
  useEffect(() => {
    let allLists = getAllLists();
    setLists(allLists);
  }, [])

  const onAddCard = useCallback((listId: string) => {
    setIsAddingCard(true);
    setCardBeingAdded(prev => ({...prev, listId: listId}))
  }, []);

  const onSaveCard = useCallback(() => {
    const cardToAdd: Card = {
      ...cardBeingAdded.card,
      id: uuid(),
      dateCreated: new Date(),
    }
    const newLists = addCardItem(cardToAdd, cardBeingAdded.listId);
    setCardBeingAdded({} as {listId: string, card: Card});
    setIsAddingCard(false);
    setLists(newLists);
  }, [cardBeingAdded]);

  const onAddList = useCallback(() => {
    setIsAddingList(true);
  }, []);

  const onSaveList = useCallback(() => {
    const listToAdd: List = {
      ...listBeingAdded,
      id: uuid(),
      cards: [],
    }
    const newLists = addList(listToAdd);
    setListBeingAdded({} as List);
    setIsAddingList(false);
    setLists(newLists);
  }, [listBeingAdded]);

  const updateCardBeingAdded = useCallback((key: keyof Card, value: any) => {
    setCardBeingAdded(prev => ({...prev, card: {...prev.card, [key]: value}}))
  }, []);

  const onDeleteCard = useCallback((cardId: string, listId: string) => {
    const newLists = deleteCard(cardId, listId);
    setLists(newLists);
  }, []);

  const onDeleteList = useCallback((listId: string) => {
    const newLists = deleteList(listId);
    setLists(newLists);
  }, []);

  const onDrop = useCallback((result: DropResult) => {
    const {source, destination} = result;
    const sourceListId: string = source.droppableId;
    const destinationListId: string = destination?.droppableId || '';
    if (sourceListId === destinationListId) return;
    if (!sourceListId || !destinationListId) return;

    const sourceCardIndex = source.index;
    const destinationCardIndex = destination?.index || -1;
    const allLists = transferCard(sourceListId, destinationListId, sourceCardIndex, destinationCardIndex);
    setLists(allLists);
  }, [])

  return (
    <>
      <div>
        <Header />
        <div className="add-list-container">
          <div className="button" onClick={onAddList}>+ Add New List</div>
        </div>
        <div className="lists">
          <DragDropContext onDragEnd={onDrop}>
          {lists.map(list => {
            return <Droppable key={list.id} droppableId={list.id}>
              {(provided, snapshot) =>
                <div ref={provided.innerRef}>
                  <ListItem
                    key={list.id}
                    onAddCard={() => onAddCard(list.id)}
                    onDeleteList={() => onDeleteList(list.id)}
                    onDeleteCard={(cardId: string) => onDeleteCard(cardId, list.id)} list={list}
                  />
                  {provided.placeholder}
                </div>}
            </Droppable>
          })}
          </DragDropContext>
        </div>
      </div>
      <Modal onClose={() => setIsAddingCard(false)} open={isAddingCard} header="Add a new card">
        <label htmlFor="card-name">Title</label>
        <input id="card-name" onChange={e => updateCardBeingAdded('title', e.currentTarget.value)} value={cardBeingAdded?.card?.title || ''} type="text" className="input" />
        <label htmlFor="card-description">Description</label>
        <input id="card-description" onChange={e => updateCardBeingAdded('description', e.currentTarget.value)} value={cardBeingAdded?.card?.description || ''} type="text" className="input" />
        <div className="button" onClick={onSaveCard}>Save</div>
      </Modal>

      <Modal onClose={() => setIsAddingList(false)} open={isAddingList} header="Add a new list">
        <label htmlFor="list-name">Title</label>
        <input id="list-name" onChange={e => setListBeingAdded(prev => ({...prev, title: e.target.value}))} value={listBeingAdded?.title || ''} type="text" className="input" />
         <div className="button" onClick={onSaveList}>Save</div>
      </Modal>
    </>

  );
}

export default App;
