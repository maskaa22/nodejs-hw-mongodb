import createHttpError from "http-errors";
import { allContacts, oneContactForId } from "../services/contacts.js";


export const getAllContactController = async (req, res) => {
    const contacts = await allContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  };

export const getContactByIdController = async (req, res, next) => {
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