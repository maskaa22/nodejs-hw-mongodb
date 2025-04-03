import createHttpError from 'http-errors';
import {
  allContacts,
  createContact,
  deleteContactForId,
  oneContactForId,
  updateContactForId,
} from '../services/contacts.js';

export const getAllContactController = async (req, res) => {
  const contacts = await allContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contacts = await oneContactForId(contactId);

  if (!contacts) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contacts,
  });
};

export const newContactController = async (req, res) => {
  const data = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  const data = await updateContactForId(contactId, req.body);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const data = await deleteContactForId(contactId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
