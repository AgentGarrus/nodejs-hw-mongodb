const Contact = require('../models/contact');

const getContacts = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;
  const contacts = await Contact.find()
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(Number(perPage));
  
  const totalItems = await Contact.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
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