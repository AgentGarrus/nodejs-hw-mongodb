const Contact = require('../models/contact');

const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

module.exports = { getContacts, getContactById };