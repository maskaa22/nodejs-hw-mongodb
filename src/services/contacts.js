import { ContactsCollection } from '../db/models/contacts.js';

export const allContacts = async () => {
  return await ContactsCollection.find();
};

export const oneContactForId = async (id) => {
  return await ContactsCollection.findById(id);
};

export const createContact = async (contact) => {
  return await ContactsCollection.create(contact);
};

export const updateContactForId = async (_id, contact) => {
  return ContactsCollection.findOneAndUpdate({ _id }, contact, { new: true });
};

export const deleteContactForId = async (_id) => {
  return ContactsCollection.findOneAndDelete({ _id });
};
