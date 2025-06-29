const express = require('express');
const XLSX = require('xlsx');
const { uploadExcel } = require('../configs/global-config');
const Eleve = require('../schemas/eleve-schema'); // Ton modèle
const Pointure =require('../schemas/pointure-schema');
const Conjointe = require("../schemas/conjointe-schema")
const Mere = require ("../schemas/mere-schema");
const Pere = require ("../schemas/pere-schema");
const Enfant = require("../schemas/enfant-schema");
const Soeur = require("../schemas/soeur-schema");
const Frere = require("../schemas/frere-schema");
const Accident =require ("../schemas/accident-schema");
const Sport = require ("../schemas/sport-schema");
const Diplome = require ("../schemas/diplome-schema");
const Filiere = require ("../schemas/filiere-schema")
const Note=require('../schemas/note-schema');
const Absence =require('../schemas/absence-schema');
const Cadre=require('../schemas/cadre-schema');

const router = express.Router();

router.post('/import-excel', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    function formatDate(dateStr) {
      if (typeof dateStr !== 'string') return null;
      const parts = dateStr.split('/');
      if (parts.length !== 3) return null;
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const mappedData = rawData.map(row => ({
      numeroIncorporation: row['NUM_INCORPORATION'],
      nom: row['NOM'],
      prenom: row['PRENOMS'],
      dateNaissance: formatDate(row['DATE D NAISSANCE']),
      numCandidature: row['NUM CANDIDATURE'],
      lieuNaissance: row['LIEU DE NAISSANCE'],
      CIN: row['NUM CIN'],
      lieuDelivrance: row['LIEU DE DELIVRANCE'],
      lieuDuplicata: row['LIEU DUPLICATA'],
      telephone3: row['TELEPHONE3'],
      telephone2: row['TELEPHONE2'],
      telephone1: row['TELEPHONE1'],
      cour: row['cour'],
      centreConcours: row['CENTRE DE CANDIDATURE'],
      matricule: row['MATRICULE'],
      escadron: row['ESCADRON'],
      peloton: row['PELOTON'],
      genreConcours: row['GENRE CONCOURS'],
      situationFamiliale: row['SITUATION MATRIMONIALE'],
      niveau: row['DIPLOME'],
      religion: row['RELIGION'],
      tailleChemise: row['TAILLECHEMISE'],
      tourTete: row['TOURTETE'],
      pointurePantalon: row['POINTURE'],
    }));

    // 1. Création des élèves
    const eleves = await Eleve.bulkCreate(
      mappedData.map(e => {
        const { pointurePantalon, tailleChemise, tourTete, ...eleveData } = e;
        return eleveData;
      }),
      { returning: true }
    );

    // 2. Tailles
    const tailles = eleves.map((eleve, index) => {
      const d = mappedData[index];
      return {
        eleveId: eleve.id,
        pointurePantalon: d.pointurePantalon,
        tailleChemise: d.tailleChemise,
        tourTete: d.tourTete,
      };
    });

    await Pointure.bulkCreate(tailles);

    // 3. Tables liées avec eleveId uniquement
    const emptyRecords = eleves.map(e => ({ eleveId: e.id }));

    await Promise.all([
      Accident.bulkCreate(emptyRecords),
      Conjointe.bulkCreate(emptyRecords),
      Diplome.bulkCreate(emptyRecords),
      Enfant.bulkCreate(emptyRecords),
      Filiere.bulkCreate(emptyRecords),
      Frere.bulkCreate(emptyRecords),
      Mere.bulkCreate(emptyRecords),
      Pere.bulkCreate(emptyRecords),
      Sport.bulkCreate(emptyRecords),
      Soeur.bulkCreate(emptyRecords)
    ]);

    res.status(200).json({ message: 'Import réussi avec tables liées', inserted: mappedData.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur pendant l\'import', error: err });
  }
});

//note 

 /*router.post('/import-notes', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const notesToInsert = [];

    for (const row of rawData) {
      const numeroIncorporation = row['INC'];
    
      const finfetta = parseFloat(row['MOYENNE']);
      const rangfinfetta = parseInt(row['RANG'], 10);

      const eleve = await Eleve.findOne({ where: { numeroIncorporation:numeroIncorporation ,  } });

      if (eleve) {
        notesToInsert.push({
          eleveId: eleve.id,
          finfetta: finfetta,
          rangfinfetta: rangfinfetta,
          // mistage, finstage etc. peuvent rester null ou tu peux ajouter d'autres colonnes Excel
        });
      }
    }

    await Note.bulkCreate(notesToInsert);

    res.status(200).json({ message: 'Import des notes réussi', inserted: notesToInsert.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur pendant l\'import des notes', error: err });
  }
}); */

//update et ajout
router.post('/import-notes', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let notesImportees = 0;

    for (const row of rawData) {
      const numeroIncorporation = row['INC'];
      const finfetta = parseFloat(row['MOYENNE']);
      const rangfinfetta = parseInt(row['RANG'], 10);
      const cour = 79;

      // Skip lignes invalides
      if (isNaN(finfetta) || isNaN(rangfinfetta)) {
        console.log(`Données invalides pour INC=${numeroIncorporation}`);
        continue;
      }

      const eleve = await Eleve.findOne({ where: { numeroIncorporation, cour } });

      if (!eleve) {
        console.log(`Aucun élève trouvé pour INC=${numeroIncorporation}, cour=${cour}`);
        continue;
      }

      const noteExistante = await Note.findOne({ where: { eleveId: eleve.id } });

      if (noteExistante) {
        // Met à jour si déjà existante
        await noteExistante.update({
          finfetta,
          rangfinfetta
        });
      } else {
        // Sinon crée une nouvelle note
        await Note.create({
          eleveId: eleve.id,
          finfetta,
          rangfinfetta
        });
      }

      notesImportees++;
    }

    res.status(200).json({ message: 'Import des notes réussi', inserted: notesImportees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import des notes", error: err.message });
  }
});
//import absence 
router.post('/import-absences', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Nettoie les clés (ex: " DATE ABS" devient "DATE ABS")
    function cleanKeys(obj) {
      const cleaned = {};
      for (const key in obj) {
        cleaned[key.trim()] = obj[key];
      }
      return cleaned;
    }

    // Formate une date Excel ou une chaîne
    function formatDate(value) {
      if (typeof value === 'number') {
        const jsDate = new Date((value - 25569) * 86400 * 1000);
        const year = jsDate.getFullYear();
        const month = String(jsDate.getMonth() + 1).padStart(2, '0');
        const day = String(jsDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      if (typeof value === 'string') {
        const parts = value.split('/');
        if (parts.length !== 3) return null;
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      return null;
    }

    let absencesImportees = 0;
    const cour = 79; // À adapter selon le contexte

    for (const rawRow of rawData) {
      const row = cleanKeys(rawRow); // nettoie les clés
      const numeroIncorporation = row['INC'];
      const dateAbs = formatDate(row['DATE ABS']);
      const motif = row['MOTIF'];

      if (!numeroIncorporation || !dateAbs || !motif) {
        console.log(`Ligne incomplète : ${JSON.stringify(row)}`);
        continue;
      }

      const eleve = await Eleve.findOne({ where: { numeroIncorporation, cour } });

      if (!eleve) {
        console.log(`Aucun élève trouvé pour INC=${numeroIncorporation}`);
        continue;
      }

      await Absence.create({
        eleveId: eleve.id,
        date: dateAbs,
        motif: motif
      });

      absencesImportees++;
    }

    res.status(200).json({ message: 'Import des absences réussi', inserted: absencesImportees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import des absences", error: err.message });
  }
});
//foko sexe 
router.post('/import-foko', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let elevesModifies = 0;
    const cour = 79;

    for (const row of rawData) {
      const numeroIncorporation = row['NR'];
      const sexe = row['SEXE'];
      const fady = row['FOKO'];

      // Validation simple
      if (!numeroIncorporation || !sexe || !fady) {
        console.log(`Données incomplètes pour NR=${numeroIncorporation}`);
        continue;
      }

      const eleve = await Eleve.findOne({
        where: { numeroIncorporation, cour }
      });

      if (!eleve) {
        console.log(`Aucun élève trouvé pour NR=${numeroIncorporation}, cour=${cour}`);
        continue;
      }

      // Mise à jour des champs
      await eleve.update({ sexe, fady });
      elevesModifies++;
    }

    res.status(200).json({
      message: 'Mise à jour des élèves réussie',
      updated: elevesModifies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de l'import",
      error: err.message
    });
  }
});
//parent
router.post('/import-parents', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let totalAjoutes = 0;

    for (const row of rawData) {
      const numeroIncorporation = row['NumInc'];
      const lienParente = row['LienParenté']?.toUpperCase()?.trim();
      const nomParent = row['NomParent'];
      const adresseParent = row['adresseParent'] || null;
      const telParent = row['TelParent'] || null;

      if (!numeroIncorporation || !lienParente || !nomParent) {
        console.log(`Données incomplètes : ${JSON.stringify(row)}`);
        continue;
      }

      const eleve = await Eleve.findOne({ where: { numeroIncorporation: numeroIncorporation } });
      if (!eleve) {
        console.log(`Élève introuvable pour NumInc=${numeroIncorporation}`);
        continue;
      }

      const eleveId = eleve.id;

      switch (lienParente) {
        case 'PERE':
          await Pere.create({ eleveId, nom: nomParent, adresse: adresseParent, phone: telParent });
          totalAjoutes++;
          break;
        case 'MERE':
          await Mere.create({ eleveId, nom: nomParent, adresse: adresseParent, phone: telParent });
          totalAjoutes++;
          break;
        case 'CONJOINTE':
          await Conjointe.create({ eleveId, nom: nomParent, adresse: adresseParent, phone: telParent });
          totalAjoutes++;
          break;
        case 'FRERE':
          await Frere.create({ eleveId, nom: nomParent });
          totalAjoutes++;
          break;
        case 'SOEUR':
          await Soeur.create({ eleveId, nom: nomParent });
          totalAjoutes++;
          break;
        default:
          console.log(`LienParenté non reconnu : ${lienParente}`);
      }
    }

    res.status(200).json({
      message: 'Importation terminée',
      totalAjoutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de l'import",
      error: err.message
    });
  }
});
//cadre 
router.post('/import-cadres', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    function cleanKeys(obj) {
      const cleaned = {};
      for (const key in obj) {
        cleaned[key.trim()] = obj[key];
      }
      return cleaned;
    }

    let cadresImportes = 0;

    for (const rawRow of rawData) {
      const row = cleanKeys(rawRow);

      const nom = row['NOM ET PRENOMS'];
      const matricule = row['MLE'];
      const grade = row['GRADE'];
      const service = row['UNITE'];
      const phone = row['NR TPH'];

      if (!nom || !matricule || !grade || !service) {
        console.log(`Ligne incomplète : ${JSON.stringify(row)}`);
        continue;
      }

      await Cadre.create({
        nom: nom.trim(),
        matricule: String(matricule).trim(),
        grade: grade.trim(),
        service: service.trim(),
        phone: phone
      });

      cadresImportes++;
    }

    res.status(200).json({ message: 'Import des cadres réussi', inserted: cadresImportes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import des cadres", error: err.message });
  }
});
//mandefa matricule fotsiny 
router.post('/import-matricules', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    function cleanKeys(obj) {
      const cleaned = {};
      for (const key in obj) {
        cleaned[key.trim()] = obj[key];
      }
      return cleaned;
    }

    let lignesModifiees = 0;
    const coursId = 79;

    for (const rawRow of rawData) {
      const row = cleanKeys(rawRow);

      const numeroIncorporation = row['INC'];
      const matricule = row['MLE'];

      if (!numeroIncorporation || !matricule) {
        console.log(`Ligne incomplète : ${JSON.stringify(row)}`);
        continue;
      }

      // Mise à jour de l'élève correspondant
      const [updated] = await Eleve.update(
        { matricule: String(matricule).trim() },
        {
          where: {
            numeroIncorporation: String(numeroIncorporation).trim(),
            cour: coursId
          }
        }
      );

      if (updated > 0) {
        lignesModifiees++;
      } else {
        console.warn(`Aucun élève trouvé pour INC=${numeroIncorporation} (cours=${coursId})`);
      }
    }

    res.status(200).json({
      message: 'Mise à jour des matricules réussie',
      updated: lignesModifiees
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import", error: err.message });
  }
});

//mandefa numero phone 
router.post('/import-numero', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    function cleanKeys(obj) {
      const cleaned = {};
      for (const key in obj) {
        cleaned[key.trim()] = obj[key];
      }
      return cleaned;
    }

    let lignesModifiees = 0;
    const coursId = 79;

    for (const rawRow of rawData) {
      const row = cleanKeys(rawRow);

      const numero = row['TPH TENA IZY'];
      const matricule = row['MLE'];

      if (!numero || !matricule) {
        console.log(`Ligne incomplète : ${JSON.stringify(row)}`);
        continue;
      }

      // Mise à jour de l'élève correspondant
      const [updated] = await Eleve.update(
        { telephone1: numero },
        {
          where: {
            matricule: String(matricule).trim(),
            cour: coursId
          }
        }
      );

      if (updated > 0) {
        lignesModifiees++;
      } else {
        console.warn(`Aucun élève trouvé pour MLE=${matricule} (cours=${coursId})`);
      }
    }

    res.status(200).json({
      message: 'Mise à jour des matricules réussie',
      updated: lignesModifiees
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import", error: err.message });
  }
});


module.exports = router;



