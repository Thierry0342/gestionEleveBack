const express = require('express');
const XLSX = require('xlsx');
const { uploadExcel } = require('../configs/global-config');
const Eleve = require('../schemas/eleve-schema'); // Ton modèle
const Pointure =require('../schemas/pointure-schema');
const Note=require('../schemas/note-schema');

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
    
    // Mapping Excel → DB
    const mappedData = rawData.map(row => ({
      
      
      numeroIncorporation: row['NUM_INCORPORATION'],
      nom: row['NOM'],
      prenom: row['PRENOMS'],
      dateNaissance: formatDate(row['DATE D NAISSANCE']),
      numCandidature:row['NUM CANDIDATURE'],
      lieuNaissance:row['LIEU DE NAISSANCE'],
      CIN:row['NUM CIN'],
      //  dateDelivrance:row['DATE DE DELIVRANCE'],
      lieuDelivrance:row['LIEU DE DELIVRANCE'],
      // duplicata:row['DATE DUPLICATA'],
      lieuDuplicata:row['LIEU DUPLICATA'],
      telephone3:row['TELEPHONE3'],
      telephone2:row['TELEPHONE2'],
      telephone1:row['TELEPHONE1'],
      cour:row['cour'],
      centreConcours:row['CENTRE DE CANDIDATURE'],
      matricule:row['MATRICULE'],
      escadron:row['ESCADRON'],
      peloton:row['PELOTON'],
      genreConcours:row['GENRE CONCOURS'],
      situationFamiliale:row['SITUATION MATRIMONIALE'],
      niveau:row['DIPLOME'],
      religion:row['RELIGION'],

      //pointure
      tailleChemise:row['TAILLECHEMISE'],
      tourTete:row['TOURTETE'],
      pointurePantalon:row['POINTURE'],

    }));

   // 1. Création des élèves (sans les tailles)
   const eleves = await Eleve.bulkCreate(
    mappedData.map(e => {
      const { pointurePantalon, tailleChemise, tourTete, ...eleveData } = e;
      return eleveData;
    }),
    { returning: true }
  );
   // 2. Création des tailles liées aux élèves
   const tailles = eleves.map((eleve, index) => {
    const d = mappedData[index];
    return {
      eleveId: eleve.id,
      pointurePantalon: d.pointurePantalon,
      tailleChemise: d.tailleChemise,
      tourTete: d.tourTete
    };
  });

  await Pointure.bulkCreate(tailles);

    res.status(200).json({ message: 'Import réussi', inserted: mappedData.length });
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

module.exports = router;



