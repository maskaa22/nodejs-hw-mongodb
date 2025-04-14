import createHttpError from 'http-errors';
import {
  allContacts,
  createContact,
  deleteContactForId,
  oneContactForId,
  updateContactForId,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await allContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const userId = req.user._id;

  const contacts = await oneContactForId({ contactId, userId });

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
  const userId = req.user._id;

  const data = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const data = await updateContactForId(contactId, req.body, userId);

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
  const userId = req.user._id;

  const data = await deleteContactForId(contactId, userId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
