const { getContacts, getContactById } = require('../services/contacts');

const getAllContacts = async (req, res) => {
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getContact = async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllContacts, getContact };