import Contact from '../models/Contact.js';

const contactService = {
  createContact: async (contactData) => {
    const { name, email, subject, message } = contactData;
    
    if (!name || !email || !subject || !message) {
      throw new Error('All fields are required');
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    return await newContact.save();
  },

  getAllContacts: async () => {
    return await Contact.find({}).sort({ createdAt: -1 });
  },

  getContactById: async (id) => {
    const contact = await Contact.findById(id);
    if (!contact) throw new Error('Contact message not found');
    return contact;
  },

  updateContactStatus: async (id, status) => {
    const contact = await Contact.findById(id);
    if (!contact) throw new Error('Contact message not found');

    contact.status = status;
    return await contact.save();
  },

  deleteContact: async (id) => {
    const contact = await Contact.findById(id);
    if (!contact) throw new Error('Contact message not found');

    await contact.deleteOne();
    return { message: 'Contact message deleted successfully' };
  }
};

export default contactService;