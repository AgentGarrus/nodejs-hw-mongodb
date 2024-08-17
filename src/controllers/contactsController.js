const createError = require('http-errors');
const { getContacts, getContactById, createContact: createContactService, updateContactById, deleteContactById } = require('../services/contacts');

const createContact = async (req, res, next) => {
  try {
    const contactData = { ...req.body, userId: req.user._id };
    const newContact = await createContactService(contactData);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const contacts = await getContacts(page, perPage, sortBy, sortOrder, req.user._id);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user._id);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await updateContactById(req.params.contactId, req.body, req.user._id);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await deleteContactById(req.params.contactId, req.user._id);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllContacts, getContact, createContact, updateContact, deleteContact };