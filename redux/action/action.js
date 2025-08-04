import { ADD_CONTACT, DELETE_CONTACT } from "../constants/constants";

export const addContact = (contact) => ({
  type: ADD_CONTACT,
  payload: contact,
});

export const deleteContact = (index) => ({
  type: DELETE_CONTACT,
  payload: index,
});

export const updateContact = (index, updatedContact) => ({
  type: 'UPDATE_CONTACT',
  payload: { index, updatedContact },
});

