const { createLog } = require('../service/logs-service');

// Fonction pour traduire les méthodes HTTP en actions humaines
const humanReadableAction = {
  POST: "AJOUT",
  PUT: "MODIFICATION",
  PATCH: "MODIFICATION",
  DELETE: "SUPPRESSION",
  GET: "CONSULTATION"
};

const logMiddleware = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const method = req.method;
  const url = req.originalUrl;
  const body = req.body;

  const action = humanReadableAction[method] || method;

  let details = '';

  if (method === 'POST') {
    const entity = getEntityFromUrl(url);
    details = `Ajout d’un(e) ${entity} avec les données : `;
  }

  else if (method === 'PUT' || method === 'PATCH') {
    const { entity, id } = getEntityAndId(url);
    details = `Modification du/de la ${entity} ID ${id}  `;
  }

  else if (method === 'DELETE') {
    const { entity, id } = getEntityAndId(url);
    details = `Suppression de la ${entity} ID ${id}`;
  }

  else if (method === 'GET') {
    const { entity, id } = getEntityAndId(url);
    if (id) {
      details = `Consultation du/de la ${entity} ID ${id}`;
    } else {
      details = `Consultation de la liste des ${entity}s`;
    }
  }

  if (userId && details) {
    await createLog(userId, action, details);
  }

  next();
};

// 🔧 Aide pour extraire l'entité et l'ID depuis l'URL
function getEntityAndId(url) {
  const parts = url.split('/').filter(p => p && p !== 'api');
  const entity = formatEntity(parts[0]);
  const id = parts[1] || null;
  return { entity, id };
}

function getEntityFromUrl(url) {
  const parts = url.split('/').filter(p => p && p !== 'api');
  return formatEntity(parts[0]);
}

// 🪄 Mise en forme de l'entité pour qu'elle soit plus lisible
function formatEntity(entity) {
  const dictionnaire = {
    eleve: "élève",
    mere: "mère",
    pere: "père",
    cadre: "cadre",
    consultation: "consultation",
    absence: "absence",
    logs: "journal",
    // Ajoute ici d'autres traductions si besoin
  };

  return dictionnaire[entity?.toLowerCase()] || entity;
}

module.exports = logMiddleware;
