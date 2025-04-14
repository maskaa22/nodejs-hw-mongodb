import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const allContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const oneContactForId = async ({ contactId, userId }) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (contact) => {
  return await ContactsCollection.create(contact);
};

export const updateContactForId = async (_id, contact, userId) => {
  return ContactsCollection.findOneAndUpdate({ _id, userId }, contact, {
    new: true,
  });
};

export const deleteContactForId = async (_id, userId) => {
  return ContactsCollection.findOneAndDelete({ _id, userId });
};
