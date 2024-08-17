const Contact = require('../models/contact');

const getContacts = async (page, perPage, sortBy, sortOrder, userId) => {
  const skip = (page - 1) * perPage;
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const contacts = await Contact.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(Number(perPage));
  
  const totalItems = await Contact.countDocuments({ userId });
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

const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const updateContactById = async (id, contactData, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, contactData, { new: true });
};

const deleteContactById = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

module.exports = { getContacts, getContactById, createContact, updateContactById, deleteContactById };