const { GraphQLUpload } = require('graphql-upload');
const { Phonebook } = require('./models');
const { Op } = require('sequelize');

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    contacts: async (_, { search = '', sortBy = 'name', sortOrder = 'asc', offset = 0, limit = 10 }) => {
      const whereClause = search 
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { phone: { [Op.iLike]: `%${search}%` } }
            ]
          }
        : {};

      const contacts = await Phonebook.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder.toUpperCase()]],
        offset,
        limit
      });

      return contacts;
    },

    totalContacts: async (_, { search = '' }) => {
      const whereClause = search 
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { phone: { [Op.iLike]: `%${search}%` } }
            ]
          }
        : {};

      return await Phonebook.count({ where: whereClause });
    }
  },

  Mutation: {
    uploadPhoto: async (_, { id, file }) => {
      try {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const path = `uploads/${filename}`;
        
        // Handle file upload logic here
        // For now, we'll just update the photo path in the database
        const contact = await Phonebook.findByPk(id);
        if (!contact) {
          throw new Error('Contact not found');
        }

        await contact.update({ photo: path });
        return contact;
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    },

    deleteContact: async (_, { id }) => {
      try {
        const contact = await Phonebook.findByPk(id);
        if (!contact) {
          throw new Error('Contact not found');
        }
        await contact.destroy();
        return true;
      } catch (error) {
        console.error('Error deleting contact:', error);
        return false;
      }
    }
  }
};

module.exports = resolvers;