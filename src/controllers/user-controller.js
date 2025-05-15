const user_service = require("../service/user-service");
const {createLog} = require ('../service/logs-service');
// Obtenir tous les user
exports.getAlluser = async (req, res) => {
  try {
    const user = await user_service.findAllUser();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
    console.log(err);
  }
};

// Créer un user
exports.createUser = async (req, res) => {
    try {
      const { username, password, type } = req.body;
     // console.log(req.body);
      const newUser = await user_service.createUser({ username, password, type });
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ error: 'Erreur lors de la création.' });
      console.log(err);
    }
  };
  

// Supprimer un cours
exports.deleteUser = async (req, res) => {
  try {
    await user_service.deleteUser(req.params.id);
    res.json({ message: 'User supprimé' });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la suppression du cours.' });
    console.log(err)
  }
};
// Authentifier un utilisateur
exports.authenticateUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await user_service.findUserByUsername(username);
  
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      if (user.password !== password) { 
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }
  
      res.status(200).json({ message: "Authentification réussie", user });
      //log
      await createLog(user.id, 'Connexion', `Utilisateur ${user.username} connecté`);
    } catch (err) {
      console.error("Erreur d'authentification", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, type } = req.body;
  
      if (!username || !type) {
        return res.status(400).json({ error: "Données incomplètes pour la mise à jour." });
      }
  
      const updatedUser = await user_service.updateUser(id, { username, type });
  
      if (!updatedUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
  
      res.json({ message: "Utilisateur modifié avec succès", updatedUser });
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
      res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
  };
  

