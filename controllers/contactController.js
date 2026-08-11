import contactService from '../services/contactService.js';

const contactController = {
  createContact: async (req, res) => {
    try {
      const contact = await contactService.createContact(req.body);
      res.status(201).json({ 
        success: true, 
        message: 'Your message has been sent successfully', 
        data: contact 
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAllContacts: async (req, res) => {
    try {
      const contacts = await contactService.getAllContacts();
      res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getContactById: async (req, res) => {
    try {
      const contact = await contactService.getContactById(req.params.id);
      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  updateContactStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const updatedContact = await contactService.updateContactStatus(req.params.id, status);
      res.status(200).json({ success: true, data: updatedContact });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const result = await contactService.deleteContact(req.params.id);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
};

export default contactController;