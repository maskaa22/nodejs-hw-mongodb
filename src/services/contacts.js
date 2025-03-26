import { ContactsCollection } from '../db/models/contacts.js';

export const allContacts = async () => {
  try {
    return await ContactsCollection.find();
  } catch (err) {
    throw new Error(err);
  }
};

export const oneContactForId = async (id) => {
  try {
    return await ContactsCollection.findById(id);
  } catch (err) {
    throw new Error(err);
  }
};
