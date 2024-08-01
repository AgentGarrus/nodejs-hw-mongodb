const Contact = require('../models/contact');

const getContacts = async () => {
  return await Contact.find();
};

const getContactById = async (id) => {
  return await Contact.findById(id);
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const updateContactById = async (id, contactData) => {
  return await Contact.findByIdAndUpdate(id, contactData, { new: true });
};

const deleteContactById = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

module.exports = { getContacts, getContactById, createContact, updateContactById, deleteContactById };