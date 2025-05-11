const User = require("../schemas/user-schema");

// Créer
async function createUser(data) {
  return User.create(data);
}

// Obtenir tou
async function findAllUser() {
  return User.findAll(); // tri
}

async function deleteUser(id) {
    return User.destroy({ where: { id } }); //  
  }
  async function findUserByUsername(username) {
    return User.findOne({ where: { username } });
  }
  async function updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
  
    await user.update(data);
    return user;
  }
module.exports = {
    createUser,
    findAllUser,
    deleteUser,
    findUserByUsername,
    updateUser
};
