const eleve_service = require("../service/eleve-service");
const pointure_service = require("../service/pointure-service");
const conjointe_service = require("../service/conjoite-service");
const mere_service = require("../service/mere-service");
const pere_service = require("../service/pere-service");
const enfant_service = require("../service/enfant-service");
const soeur_service = require("../service/soeur-service");
const frere_service = require("../service/frere-service");
const accident_service = require("../service/accident-service");
const sport_service = require("../service/sport-service");
const diplome_service = require("../service/diplome-service");
const filiere_service = require("../service/filiere-service");
const tuteur_service = require("../service/tuteur-service");

const DB = require("../data-access/database-connection");


// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────
async function create(req, res, next) {
  const t = await DB.transaction();
  try {
    // ── Image ──────────────────────────────────────────────────────────────
    const imageFile = req.file;
    const imageUrl = imageFile
      ? `/data/uploads/pictures/images/${imageFile.filename}`
      : null;

    const data = {
      ...req.body,
      image: imageUrl,
    };

    // ── Parse les champs JSON ──────────────────────────────────────────────
    const pointureData = req.body.pointure ? JSON.parse(req.body.pointure) : null;

    const familleData   = req.body.famille ? JSON.parse(req.body.famille) : {};
    const conjointeData = familleData.conjointe  || null;
    const mereData      = familleData.mere       || null;
    const pereData      = familleData.pere       || null;
    const accidentData  = familleData.accidents  || null;
    const tuteurData    = familleData.tuteur     || null;
    const enfantData    = familleData.enfants    || [];
    const soeurData     = familleData.soeur      || [];
    const frereData     = familleData.frere      || [];

    const sportData   = req.body.sports   ? JSON.parse(req.body.sports)   : [];
    const diplomeData = req.body.diplomes ? JSON.parse(req.body.diplomes) : [];

    // ── Création de l'élève ────────────────────────────────────────────────
    console.log(data);
    const newEleve = await eleve_service.create(data);

    // ── Pointure ──────────────────────────────────────────────────────────
    if (pointureData) {
      await pointure_service.create(
        { ...pointureData, eleveId: newEleve.id },
        { transaction: t }
      );
    }

    // ── Conjointe ─────────────────────────────────────────────────────────
    if (conjointeData) {
      await conjointe_service.create(
        {
          nom:     conjointeData.nom,
          adresse: conjointeData.adresse,
          phone:   conjointeData.phone,
          eleveId: newEleve.id,
        },
        { transaction: t }
      );
    }

    // ── Mère ──────────────────────────────────────────────────────────────
    if (mereData) {
      await mere_service.create(
        {
          nom:     mereData.nom,
          adresse: mereData.adresse,
          phone:   mereData.phone,
          eleveId: newEleve.id,
        },
        { transaction: t }
      );
    }

    // ── Père ──────────────────────────────────────────────────────────────
    if (pereData) {
      await pere_service.create(
        {
          nom:     pereData.nom,
          adresse: pereData.adresse,
          phone:   pereData.phone,
          eleveId: newEleve.id,
        },
        { transaction: t }
      );
    }

    // ── Accident ──────────────────────────────────────────────────────────
    if (accidentData) {
      await accident_service.create(
        {
          nom:        accidentData.nom,
          adresse:    accidentData.adresse,
          phone:      accidentData.phone,
          profession: accidentData.profession,
          estFDS:     accidentData.estFDS     || false,
          gradeFDS:   accidentData.gradeFDS,
          posteFDS:   accidentData.posteFDS,
          eleveId:    newEleve.id,
        },
        { transaction: t }
      );
    }

    // ── Tuteur ────────────────────────────────────────────────────────────
    if (tuteurData) {
      await tuteur_service.create(
        {
          nom:         tuteurData.nom,
          adresse:     tuteurData.adresse,
          phone:       tuteurData.phone,
          lienParente: tuteurData.lienParente,
          profession:  tuteurData.profession,
          estFDS:      tuteurData.estFDS  || false,
          gradeFDS:    tuteurData.gradeFDS,
          posteFDS:    tuteurData.posteFDS,
          eleveId:     newEleve.id,
        },
        { transaction: t }
      );
    }

    // ── Enfants ───────────────────────────────────────────────────────────
    if (enfantData.length > 0) {
      for (const enfant of enfantData) {
        await enfant_service.create(
          {
            nom:           enfant.nom,
            dateNaissance: enfant.dateNaissance,
            sexe:          enfant.sexe,
            eleveId:       newEleve.id,
          },
          { transaction: t }
        );
      }
    }

    // ── Sœurs ─────────────────────────────────────────────────────────────
    if (soeurData.length > 0) {
      for (const soeur of soeurData) {
        await soeur_service.create(
          { nom: soeur.nom, eleveId: newEleve.id },
          { transaction: t }
        );
      }
    }

    // ── Frères ────────────────────────────────────────────────────────────
    if (frereData.length > 0) {
      for (const frere of frereData) {
        await frere_service.create(
          { nom: frere.nom, eleveId: newEleve.id },
          { transaction: t }
        );
      }
    }

    // ── Sports ────────────────────────────────────────────────────────────
    if (Array.isArray(sportData)) {
      const sportPayload = {
        eleveId:     newEleve.id,
        Football:    false,
        Basketball:  false,
        Rugby:       false,
        Volley_ball: false,
        Musculation: false,
        Athletisme:  false,
        Tennis:      false,
        ArtsMartiaux: false,
        Autre:       false,
      };

      const sportMapping = {
        Football:      "Football",
        Basketball:    "Basketball",
        Rugby:         "Rugby",
        Musculation:   "Musculation",
        "Volley-ball": "Volley_ball",
        Athlétisme:    "Athletisme",
        Tennis:        "Tennis",
        "arts martiaux": "ArtsMartiaux",
        Autre:         "Autre",
      };

      sportData.forEach(sport => {
        const key = sportMapping[sport];
        if (key) sportPayload[key] = true;
      });

      await sport_service.create(sportPayload, { transaction: t });
    }

    // ── Diplômes ──────────────────────────────────────────────────────────
    if (Array.isArray(diplomeData)) {
      const diplomePayload = {
        eleveId:       newEleve.id,
        CEPE:          false,
        BEPC:          false,
        BACC_S:        false,
        BACC_L:        false,
        BACC_TECHNIQUE: false,
        Licence:       false,
        MasterOne:     false,
        MasterTwo:     false,
        Doctorat:      false,
      };

      const diplomeMapping = {
        CEPE:           "CEPE",
        BEPC:           "BEPC",
        "BACC S":       "BACC_S",
        BACC_TECHNIQUE: "BACC_TECHNIQUE",
        Licence:        "Licence",
        "Master One":   "MasterOne",
        "Master Two":   "MasterTwo",
        Doctorat:       "Doctorat",
      };

      diplomeData.forEach(diplome => {
        const key = diplomeMapping[diplome];
        if (key) diplomePayload[key] = true;
      });

      // Filières associées aux diplômes supérieurs
      await filiere_service.create(
        {
          eleveId:         newEleve.id,
          filiereLicence:  req.body.filiereLicence,
          filiereDoctorat: req.body.filiereDoctorat,
          filiereMasterTwo: req.body.filiereMasterTwo,
          filiereMasterOne: req.body.filiereMasterOne,
        },
        { transaction: t }
      );

      await diplome_service.create(diplomePayload, { transaction: t });
    }

    // ── Commit ────────────────────────────────────────────────────────────
    await t.commit();
    const eleve = await eleve_service.findByPk(newEleve.id);
    res.status(201).json(eleve);

  } catch (error) {
    await t.rollback();
    console.error("Erreur lors de la création d'un élève :", error);
    res.status(500).json({ message: error.message || error });
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────────────────────────────────────
async function getAll(req, res) {
  try {
    const limit  = parseInt(req.query.limit)  || 500;
    const offset = parseInt(req.query.offset) || 0;

    const eleves  = await eleve_service.findAll({ limit, offset });
    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const elevesWithImage = eleves.map(eleve => {
      const plainEleve = eleve.toJSON();
      return {
        ...plainEleve,
        image: plainEleve.image ? `${hostUrl}${plainEleve.image}` : null,
      };
    });

    res.status(200).json(elevesWithImage);
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves :", error);
    res.status(500).json({ message: error.message });
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────
async function deleteByPk(req, res, next) {
  try {
    await eleve_service.deleteByPk(req.params.id);
    res.status(200).json({ message: "Élève supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────
async function update(req, res) {
  try {
    const { id } = req.params;
    let updatedData = req.body;

    // Utilitaire de parsing JSON sécurisé
    function parseIfJson(field) {
      try {
        if (typeof field === "string") return JSON.parse(field);
        return field;
      } catch (e) {
        console.warn("Erreur de parsing JSON:", e);
        return null;
      }
    }

    // ── Parse les champs complexes ─────────────────────────────────────────
    updatedData.famille  = parseIfJson(updatedData.famille);
    updatedData.sports   = parseIfJson(updatedData.sports);
    updatedData.diplomes = parseIfJson(updatedData.diplomes);
    updatedData.Pointure = parseIfJson(updatedData.Pointure);
    updatedData.Filiere  = parseIfJson(updatedData.Filiere);

    // ── Image ──────────────────────────────────────────────────────────────
    if (req.file) {
      updatedData.image = `/data/uploads/pictures/images/${req.file.filename}`;
    }
    // ── Sports (upsert) ────────────────────────────────────────────────────────
const sportsData = updatedData.sports; // array, ex: ['Football', 'Autre']
if (Array.isArray(sportsData)) {
  const sportPayload = {
    Football:    sportsData.includes('Football'),
    Basketball:  sportsData.includes('Basketball'),
    Rugby:       sportsData.includes('Rugby'),
    Musculation: sportsData.includes('Musculation'),
    Volley_ball: sportsData.includes('Volley_ball'),
    Athletisme:  sportsData.includes('Athletisme'),
    Tennis:      sportsData.includes('Tennis'),
    ArtsMartiaux: sportsData.includes('ArtsMartiaux'),
    Autre:       sportsData.includes('Autre'),
    // autresSport vient directement du body (string simple)
    autresSport: updatedData.autresSport || null,
  };
  await sport_service.upsert(id, sportPayload);
}

    // ── Tuteur (upsert) ────────────────────────────────────────────────────
    const tuteurData = updatedData.famille?.tuteur || null;
    // LOG 2 : Vérifier spécifiquement l'objet tuteur
    if (tuteurData) {
      console.log(">>> Données Tuteur identifiées pour l'élève ID " + id + " :", tuteurData);
    } else {
      console.warn(">>> Aucun tuteur trouvé dans l'objet famille.");
    }
    if (tuteurData) {
      await tuteur_service.upsert(id, {
        nom:         tuteurData.nom,
        adresse:     tuteurData.adresse,
        phone:       tuteurData.phone,
        lienParente: tuteurData.lienParente,
        profession:  tuteurData.profession,
        estFDS:      tuteurData.estFDS  || false,
        gradeFDS:    tuteurData.gradeFDS,
        posteFDS:    tuteurData.posteFDS,
      });
    }

    // ── Mise à jour principale via le service ──────────────────────────────
    const eleve = await eleve_service.updateById(id, updatedData, {
      transaction: req.transaction,
    });

    res.status(200).json(eleve);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// GET BY INCORPORATION
// ─────────────────────────────────────────────────────────────────────────────
async function getEleveByIncorporation(req, res) {
  try {
    const inc  = req.params.inc;
    const cour = req.query.cour;

    if (!inc || !cour) {
      return res.status(400).json({ message: "Incorporation et cours sont nécessaires" });
    }

    const eleve = await eleve_service.findByIncorporation({ incorporation: inc, cour });

    if (!eleve) {
      return res.status(404).json({ message: "Élève non trouvé pour ce cours" });
    }

    res.json({ eleve });
  } catch (error) {
    console.error("Erreur récupération élève :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}


module.exports = { create, getAll, deleteByPk, update, getEleveByIncorporation };
