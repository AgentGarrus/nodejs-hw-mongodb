const createError = require('http-errors');
const { getContacts, getContactById, createContact: createContactService, updateContactById, deleteContactById } = require('../services/contacts');

const getAllContacts = async (req, res) => {
  const contacts = await getContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts
  });
};

const getContact = async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact
  });
};

const createContact = async (req, res) => {
  const newContact = await createContactService(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact
  });
};

const updateContact = async (req, res) => {
  const updatedContact = await updateContactById(req.params.contactId, req.body);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact
  });
};

const deleteContact = async (req, res) => {
  const deletedContact = await deleteContactById(req.params.contactId);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};

module.exports = { getAllContacts, getContact, createContact, updateContact, deleteContact };