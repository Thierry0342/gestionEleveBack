const express = require('express');
const path = require('path');
const XLSX = require('xlsx');
const { uploadExcel, upload } = require('../configs/global-config');
const fs = require('fs');
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
const NoteFrancais=require('../schemas/noteFrancais-schema');
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
//note francais 

router.post('/import-notefrancais', uploadExcel.single('file'), async (req, res) => {
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
    let lignesCreees = 0;
    let lignesEchouees = [];
    const coursId = 79;

    for (const rawRow of rawData) {
      const row = cleanKeys(rawRow);

      const inc = row['INC'];
      const niveau = row['NIVEAU'];
      const note = row['NOTE']; // Optionnelle

      if (!inc || !niveau) {
        lignesEchouees.push({ row, reason: 'INC ou NIVEAU manquant' });
        continue;
      }

      // Chercher l'élève
      const eleve = await Eleve.findOne({
        where: {
          numeroIncorporation: String(inc).trim(),
          cour: coursId
        }
      });

      if (!eleve) {
        lignesEchouees.push({ row, reason: `Aucun élève trouvé pour INC=${inc}` });
        continue;
      }

      // Vérifier si une note existe déjà pour cet élève et ce niveau
      const [noteRecord, created] = await NoteFrancais.findOrCreate({
        where: {
          eleveId: eleve.id,
          niveau: String(niveau).trim()
        },
        defaults: {
          note: note !== undefined && note !== '' ? Number(note) : null
        }
      });

      if (!created) {
        // Une note existait déjà, on la met à jour
        await noteRecord.update({
          note: note !== undefined && note !== '' ? Number(note) : null
        });
        lignesModifiees++;
      } else {
        lignesCreees++;
      }
    }

    res.status(200).json({
      message: 'Import des notes terminé',
      inserted: lignesCreees,
      updated: lignesModifiees,
      failed: lignesEchouees.length,
      details: lignesEchouees
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import", error: err.message });
  }
});
//repartion cadre
router.post('/importrepartitioncadres', uploadExcel.single('file'), async (req, res) => {
  try {
    // Lire le fichier importé
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Nettoyer et structurer
    const cadres = rawData.map(row => ({
      grade: row['GRADE'],
      nom: row['NOM ET PRENOMS'] || row['M ET PRENOM'],
      mle: row['MLE'],
      tph: row['NR TPH'],
      unite: row['UNITE'],
    }));

    // Fonction shuffle
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Grouper par type et mélanger
    const groupe1 = shuffle(cadres.filter(c => ['GP1C', 'GP2C', 'GPHC'].includes(c.grade)));
    const groupe2 = shuffle(cadres.filter(c => ['GST', 'G1C', 'G2C', 'GHC'].includes(c.grade)));

    // Répartition ESC / PON
    const repartition = [];

    for (let esc = 1; esc <= 10; esc++) {
      for (let pon = 1; pon <= 3; pon++) {
        const cadre1 = groupe1.shift();
        const cadre2 = groupe2.shift();

        if (cadre1) {
          cadre1.esc = esc;
          cadre1.pon = pon;
          repartition.push(cadre1);
        }

        if (cadre2) {
          cadre2.esc = esc;
          cadre2.pon = pon;
          repartition.push(cadre2);
        }
      }
    }

    // Cadres restants à reprendre
    groupe1.forEach(c => {
      repartition.push({ ...c, esc: 'À reprendre', pon: '' });
    });
    groupe2.forEach(c => {
      repartition.push({ ...c, esc: 'À reprendre', pon: '' });
    });

    // Trier par ESC puis PON
    repartition.sort((a, b) => {
      if (a.esc === 'À reprendre') return 1; // Mettre les 'À reprendre' à la fin
      if (b.esc === 'À reprendre') return -1;
      if (a.esc !== b.esc) return a.esc - b.esc;
      return a.pon - b.pon;
    });

    // Ajouter NR auto-incrémenté
    const repartitionFinale = repartition.map((c, index) => ({
      NR: index + 1,
      GRADE: c.grade,
      'NOM ET PRENOMS': c.nom,
      MLE: c.mle,
      'NR TPH': c.tph,
      UNITE: c.unite,
      ESC: c.esc,
      PON: c.pon
    }));

    // Générer le fichier Excel
    const ws = XLSX.utils.json_to_sheet(repartitionFinale);
    
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, ws, 'Répartition');

    // Vérifier / créer le dossier output
    const outputDir = path.join(__dirname, '../outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, 'repartition_finale.xlsx');
    XLSX.writeFile(newWorkbook, outputPath);

    // Supprimer le fichier uploadé
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: 'Répartition terminée avec succès',
      download: '/api/download-repartition'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Erreur pendant la répartition',
      error: err.message
    });
  }
});


module.exports = router;



