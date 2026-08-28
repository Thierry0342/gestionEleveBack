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
      prenom: row['PRENOMS'] || row['PRENOM'] ,
      numeroIncorporation: row['NUM_INCORPORATION'],
      nom: row['NOM'],
      dateNaissance: formatDate(row['DATE D NAISSANCE']),
      numCandidature: row['NUM CANDIDATURE'],
      CIN: row['NUM CIN'],
      cour: row['cour'],
      centreConcours: row['CENTRE DE CANDIDATURE'],
      escadron: row['ESCADRON'],
      peloton: row['PELOTON'],
      sexe :  row['SEXE'],
    
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
//mis a jour 
router.post('/update-from-excel', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    function formatDate(dateVal) {
      if (!dateVal) return null;
      if (typeof dateVal === 'number') {
        const date = XLSX.SSF.parse_date_code(dateVal);
        if (!date) return null;
        return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
      }
      if (typeof dateVal === 'string') {
        const parts = dateVal.split('/');
        if (parts.length !== 3) return null;
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return null;
    }

    let totalUpdated = 0;
    const errors = [];
    const notFound = [];

    for (const row of rawData) {
      try {
        const numCandidature = row['NUM_INSCR'];
        if (!numCandidature) continue;

        // ── Trouver l'élève par NUM_INSCR + cour = 80 ──────────────────────
        const eleve = await Eleve.findOne({
          where: {
            numCandidature: numCandidature,
            cour: 80,
          }
        });

        if (!eleve) {
          notFound.push({ numCandidature });
          continue;
        }

        const eleveId = eleve.id;

        // ── 1. Mise à jour Eleve (CIN, LIEU CIN, ADRESSE, TELEPHONE) ───────
       const champsAMettreAJour = {};

      if (row['CIN'])       champsAMettreAJour.CIN      = row['CIN'];
      if (row['LIEU DE NAISSANCE'])       champsAMettreAJour.lieuNaissance      = row['LIEU DE NAISSANCE'];
      if (row['DATE CIN'])  champsAMettreAJour.dateDelivrance   = formatDate(row['DATE CIN']);
      if (row['LIEU CIN'])  champsAMettreAJour.lieuDelivrance   = row['LIEU CIN'];
      if (row['ADRESSE'])   champsAMettreAJour.adresseExacte   = row['ADRESSE'];
      if (row['TPH'])       champsAMettreAJour.telephone2        = row['TPH'];

      await eleve.update(champsAMettreAJour);

        // ── 2. Mise à jour Père ─────────────────────────────────────────────
        if (row['PÈRE']) {
          await Pere.update(
            { nom: row['PÈRE'] },
            { where: { eleveId } }
          );
        }

        // ── 3. Mise à jour Mère ─────────────────────────────────────────────
        if (row['MÈRE']) {
          await Mere.update(
            { nom: row['MÈRE'] },
            { where: { eleveId } }
          );
        }

        totalUpdated++;

      } catch (rowErr) {
        errors.push({
          numCandidature: row['NUM_INSCR'] || '?',
          erreur: rowErr.message,
        });
      }
    }

    res.status(200).json({
      message: 'Mise à jour terminée',
      totalUpdated,
      totalNotFound: notFound.length,
      notFound,
      totalErrors: errors.length,
      errors,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant la mise à jour", error: err.message });
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
      const mistage = parseFloat(row['MOYENNE']);
      const rangmistage = parseInt(row['RANG'], 10);
      const cour = 79;

      // Skip lignes invalides
      if (isNaN(mistage) || isNaN(rangmistage)) {
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
          mistage,
          rangmistage
        });
      } else {
        // Sinon crée une nouvelle note
        await Note.create({
          eleveId: eleve.id,
          mistage,
          rangmistage
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
router.post('/import-escadron', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    let elevesModifies = 0;
    const cour = 80;

    for (const row of rawData) {
      const numeroIncorporation = row['INC'];
      const escadron = row['ESCADRON'];
      const peloton = row['PELOTON'];

      // Validation simple
      if (!numeroIncorporation || !escadron || !peloton) {
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
      await eleve.update({ escadron, peloton });
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
      const cour = 80 

      if (!numeroIncorporation || !lienParente || !nomParent) {
        console.log(`Données incomplètes : ${JSON.stringify(row)}`);
        continue;
      }

      const eleve = await Eleve.findOne({ where: { numeroIncorporation: numeroIncorporation } } );
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
router.post('/import-fiche-cadres', uploadExcel.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);

    function sheetToRows(name) {
      const sheet = workbook.Sheets[name];
      if (!sheet) return [];
      return XLSX.utils.sheet_to_json(sheet, { defval: '' });
    }

    function cleanMatricule(v) {
      if (v === null || v === undefined) return null;
      const s = String(v).trim();
      if (s === '' || s === '-') return null;
      return s;
    }

    // Regroupe les lignes d'une feuille secondaire par matricule
    function groupByMatricule(rows) {
      const map = {};
      for (const row of rows) {
        const mle = cleanMatricule(row['matricule']);
        if (!mle) continue;
        if (!map[mle]) map[mle] = [];
        map[mle].push(row);
      }
      return map;
    }

    const cadresRows = sheetToRows('Cadres');

    const grades = groupByMatricule(sheetToRows('GradesSuccessifs'));
    const diplomes = groupByMatricule(sheetToRows('Diplomes'));
    const serments = groupByMatricule(sheetToRows('Serments'));
    const affectations = groupByMatricule(sheetToRows('Affectations'));
    const enfants = groupByMatricule(sheetToRows('Enfants'));
    const decorations = groupByMatricule(sheetToRows('Decorations'));
    const felicitations = groupByMatricule(sheetToRows('Felicitations'));
    const punitions = groupByMatricule(sheetToRows('Punitions'));
    const servicesMilitaires = groupByMatricule(sheetToRows('ServicesMilitaires'));
    const relationsInterets = groupByMatricule(sheetToRows('RelationsInterets'));
    const sanitaireRows = groupByMatricule(sheetToRows('Sanitaire'));

    let inserted = 0;
    let updated = 0;
    const echecs = [];

    for (const row of cadresRows) {
      const matricule = cleanMatricule(row['matricule']);
      const nom = row['nom'];

      if (!nom) {
        echecs.push({ row, reason: 'nom manquant' });
        continue;
      }

      // ── Champs scalaires (copie directe depuis la feuille "Cadres") ──
      const payload = {
        matricule,
        nom: String(nom).trim(),
        prenom: row['prenom'] || null,
        phone: row['phone'] || null,
        grade: row['grade'] || null,
        service: row['service'] || null,

        positionEffectiveUnite: row['positionEffectiveUnite'] || null,
        positionEffectiveFonction: row['positionEffectiveFonction'] || null,
        positionEffectiveDepuisLe: row['positionEffectiveDepuisLe'] || null,
        positionEffectiveDisponibleLe: row['positionEffectiveDisponibleLe'] || null,

        positionTheoriqueUnite: row['positionTheoriqueUnite'] || null,
        positionTheoriqueFonction: row['positionTheoriqueFonction'] || null,
        positionTheoriqueDepuisLe: row['positionTheoriqueDepuisLe'] || null,
        positionTheoriqueDisponibleLe: row['positionTheoriqueDisponibleLe'] || null,

        dateNaissance: row['dateNaissance'] || null,
        lieuNaissance: row['lieuNaissance'] || null,
        sexe: row['sexe'] || null,
        groupeSanguin: row['groupeSanguin'] || null,
        taille: row['taille'] || null,
        pereNomPrenom: row['pereNomPrenom'] || null,
        mereNomPrenom: row['mereNomPrenom'] || null,
        groupeEthnique: row['groupeEthnique'] || null,
        religion: row['religion'] || null,

        cin: row['cin'] || null,
        cinDelivreLe: row['cinDelivreLe'] || null,
        cinDelivreA: row['cinDelivreA'] || null,

        dateMariage: row['dateMariage'] || null,
        autorisationMariage: row['autorisationMariage'] || null,
        mariageRompuLe: row['mariageRompuLe'] || null,
        motifRompuMariage: row['motifRompuMariage'] || null,
        remarieLe: row['remarieLe'] || null,
        deuxiemeAutorisationMariage: row['deuxiemeAutorisationMariage'] || null,
        numeroDateJugementDeces: row['numeroDateJugementDeces'] || null,

        epouxNomPrenom: row['epouxNomPrenom'] || null,
        epouxFonction: row['epouxFonction'] || null,
        epouxMatricule: row['epouxMatricule'] || null,
        epouxCin: row['epouxCin'] || null,
        epouxOrganismeEmployeur: row['epouxOrganismeEmployeur'] || null,
        epouxRefDecisionIncorporation: row['epouxRefDecisionIncorporation'] || null,
        epouxDelivreLe: row['epouxDelivreLe'] || null,
        epouxDelivreA: row['epouxDelivreA'] || null,

        dateIncorporation: row['dateIncorporation'] || null,
        diplomeDecisionIncorporation: row['diplomeDecisionIncorporation'] || null,

        nombrePiecesJointes: row['nombrePiecesJointes'] || null,
        nombreFeuillesSupplementaires: row['nombreFeuillesSupplementaires'] || null,
      };

      // ── Champs JSON (sections répétables reliées par matricule) ──
      if (matricule) {
        payload.enfants = (enfants[matricule] || []).map(r => ({
          numero: r['numero'] || '',
          nomPrenom: r['nomPrenom'] || '',
          dateNaissance: r['dateNaissance'] || '',
          lieuNaissance: r['lieuNaissance'] || '',
          qualite: r['qualite'] || '',
          sexe: r['sexe'] || '',
          observation: r['observation'] || '',
        }));

        payload.servicesMilitaires = (servicesMilitaires[matricule] || []).map(r => ({
          typeService: r['typeService'] || '',
          dateDebut: r['dateDebut'] || '',
          dateFin: r['dateFin'] || '',
          promoClasse: r['promoClasse'] || '',
          mleSN: r['mleSN'] || '',
        }));

        payload.gradesSuccessifs = (grades[matricule] || []).map(r => ({
          grade: r['grade'] || '',
          dateNomination: r['dateNomination'] || '',
          refDecision: r['refDecision'] || '',
        }));

        payload.decorations = (decorations[matricule] || []).map(r => ({
          nature: r['nature'] || '',
          refAttribution: r['refAttribution'] || '',
          datePriseEffet: r['datePriseEffet'] || '',
        }));

        payload.felicitations = (felicitations[matricule] || []).map(r => ({
          nature: r['nature'] || '',
          reference: r['reference'] || '',
          libelle: r['libelle'] || '',
          autorite: r['autorite'] || '',
        }));

        payload.punitions = (punitions[matricule] || []).map(r => ({
          taux: r['taux'] || '',
          type: r['type'] || '',
          dpe: r['dpe'] || '',
          autoriteInfligeante: r['autoriteInfligeante'] || '',
          reference: r['reference'] || '',
          libelle: r['libelle'] || '',
        }));

        payload.diplomes = (diplomes[matricule] || []).map(r => ({
          intitule: r['intitule'] || '',
          reference: r['reference'] || '',
          entite: r['entite'] || '',
          categorie: r['categorie'] || '',
        }));

        payload.serments = (serments[matricule] || []).map(r => ({
          typePrestation: r['typePrestation'] || '',
          datePrestation: r['datePrestation'] || '',
          lieu: r['lieu'] || '',
          observations: r['observations'] || '',
        }));

        payload.affectations = (affectations[matricule] || []).map(r => ({
          unite: r['unite'] || '',
          fonction: r['fonction'] || '',
          acDuLe: r['acDuLe'] || '',
          refDecision: r['refDecision'] || '',
          motif: r['motif'] || '',
          dateDisponibilite: r['dateDisponibilite'] || '',
          referenceCR: r['referenceCR'] || '',
        }));

        payload.relationsInterets = (relationsInterets[matricule] || []).map(r => ({
          type: r['type'] || '',
          districtRegion: r['districtRegion'] || '',
        }));

        // Sanitaire : une seule ligne attendue par matricule
        const san = (sanitaireRows[matricule] || [])[0];
        if (san) {
          payload.sanitairePATC = {
            reference: san['patcReference'] || '',
            medecinTraitant: san['patcMedecinTraitant'] || '',
            nombrePATC: san['patcNombrePATC'] || '',
            dateDebutPATC: san['patcDateDebutPATC'] || '',
            renouvelable: san['patcRenouvelable'] || '',
          };
          payload.sanitaireCREFA = {
            reference: san['crefaReference'] || '',
            type: san['crefaType'] || '',
            referenceEnvoiCREFA: san['crefaReferenceEnvoiCREFA'] || '',
            referenceEnvoiFinance: san['crefaReferenceEnvoiFinance'] || '',
            observation: san['crefaObservation'] || '',
          };
        }
      }

      // ── Création ou mise à jour (upsert par matricule si présent) ──
      try {
        let existing = null;
        if (matricule) {
          existing = await Cadre.findOne({ where: { matricule } });
        }

        if (existing) {
          await existing.update(payload);
          updated++;
        } else {
          await Cadre.create(payload);
          inserted++;
        }
      } catch (rowErr) {
        echecs.push({ row: { matricule, nom }, reason: rowErr.message });
      }
    }

    res.status(200).json({
      message: 'Import des fiches cadres terminé',
      inserted,
      updated,
      failed: echecs.length,
      details: echecs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import des fiches cadres", error: err.message });
  } finally {
    try {
      await fs.promises.unlink(req.file.path);
    } catch {}
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

    let cadresModifies = 0;

    // Stocker les détails des cadres introuvables
    const cadresIntrouvables = [];

    // Stocker les détails des lignes invalides
    const lignesInvalides = [];

    for (let i = 0; i < rawData.length; i++) {
      const rawRow = rawData[i];
      const row = cleanKeys(rawRow);

      // +2 car la ligne 1 correspond généralement aux en-têtes Excel
      const numeroLigne = i + 2;

      const matricule = row['MLE'];
      const grade = row['GRADE'];

      // Vérification des données nécessaires
      if (!matricule || !grade) {
        const raisons = [];

        if (!matricule) {
          raisons.push('MLE manquant');
        }

        if (!grade) {
          raisons.push('grade');
        }

        console.log(
          `Ligne ${numeroLigne} invalide : ${JSON.stringify(row)}`
        );

        lignesInvalides.push({
          ligne: numeroLigne,
          matricule: matricule ? String(matricule).trim() : null,
          grade: grade ? String(grade).trim() : null,
          raison: raisons.join(' et ')
        });

        continue;
      }

      const matriculeClean = String(matricule).trim();
      const gradeclean = String(service).trim();

      // Recherche du cadre existant avec son matricule
      const cadre = await Cadre.findOne({
        where: {
          matricule: matriculeClean
        }
      });

      // Cadre introuvable
      if (!cadre) {
        console.log(
          `Cadre introuvable - ligne ${numeroLigne} - matricule : ${matriculeClean}`
        );

        cadresIntrouvables.push({
          ligne: numeroLigne,
          matricule: matriculeClean,
          grade: gradeclean
        });

        continue;
      }

      // Modification UNIQUEMENT du grade
      await cadre.update({
        grade: gradeclean
      });

      cadresModifies++;

      console.log(
        `Service modifié : ${cadre.matricule} -> ${gradeclean}`
      );
    }

    res.status(200).json({
      message: 'Mise à jour des services réussie',

      // Nombre de modifications
      modified: cadresModifies,

      // Cadres non trouvés
      notFound: cadresIntrouvables.length,
      notFoundDetails: cadresIntrouvables,

      // Lignes invalides
      invalid: lignesInvalides.length,
      invalidDetails: lignesInvalides
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur pendant la mise à jour des services",
      error: err.message
    });
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
    const coursId = 80;

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
//importe pointure 
// pointure : NUM_INCORPORATION | POINTURE (chaussure) | TAILLEPATALON (pantalon)
router.post('/import-pointures', uploadExcel.single('file'), async (req, res) => {
  const tempPath = req?.file?.path;
  try {
    if (!tempPath) {
      return res.status(400).json({ message: 'Fichier Excel manquant (champ "file").' });
    }

    const workbook = XLSX.readFile(tempPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // Helpers
    const cleanKeys = (obj) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.trim(), v]));

    const pick = (obj, ...keys) => {
      for (const k of keys) if (obj[k] !== undefined) return obj[k];
      return undefined;
    };

    const normalizeSize = (v) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'number') return String(v);
      const s = String(v).trim();
      return s ? s.replace(',', '.') : null;
    };

    const cour = 79; // adapte si nécessaire

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let noEleve = 0;

    for (const rawRow of rawData) {
      const row = cleanKeys(rawRow);

      // On accepte NUM_INCORPORATION (normal) ou INC (fallback)
      const numeroIncorporation = String(pick(row, 'NUM_INCORPORATION', 'INC') ?? '').trim();

      // Excel -> DB (Pointure)
      const pointureChaussure = normalizeSize(pick(row, 'POINTURE'));
      const pointurePantalon  = normalizeSize(pick(row, 'TAILLEPATALON', 'TAILLEPANTALON'));

      if (!numeroIncorporation) { skipped++; continue; }
      if (!pointureChaussure && !pointurePantalon) { skipped++; continue; }

      const whereEleve = { numeroIncorporation };
      if (cour !== undefined && !Number.isNaN(cour)) whereEleve.cour = cour;

      const eleve = await Eleve.findOne({ where: whereEleve });
      if (!eleve) {
        console.log(`Aucun élève pour NUM_INCORPORATION=${numeroIncorporation}${cour ? ' / cour=' + cour : ''}`);
        noEleve++;
        continue;
      }

      // Cherche la ligne Pointure liée à l'élève
      const payload = {};
      if (pointureChaussure) payload.pointureChaussure = pointureChaussure;
      if (pointurePantalon)  payload.pointurePantalon  = pointurePantalon;

      let rec = await Pointure.findOne({ where: { eleveId: eleve.id } });
      if (rec) {
        await rec.update(payload);
        updated++;
      } else {
        await Pointure.create({ eleveId: eleve.id, ...payload });
        inserted++;
      }
    }

    res.status(200).json({
      message: 'Import des pointures terminé',
      rows: rawData.length,
      inserted,
      updated,
      noEleve,
      skipped
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur pendant l'import des pointures", error: err.message });
  } finally {
    // Nettoyage du fichier temporaire
    try {
      // choisis l'une des deux lignes :
      // fs.unlinkSync(tempPath);
      await fs.promises.unlink(tempPath);
    } catch {}
  }
});



module.exports = router;



