// service/eleve-details-service.js
const absenceService = require("./absence-service");
const sanctionService = require("./sanctions-service");
const noteService = require("./note-service");
const consultatioService=require("./consultation-service");
async function findDetailsByEleveIds(ids) {
  // ids = tableau de eleveId
  const absences = await absenceService.findAllAbsences();
  const sanctions = await sanctionService.findAllSanctions();
  const notes = await noteService.findAllNotes();
  const consultations=await consultatioService.findAllConsultations();

  // Filtrer pour ne garder que les IDs demandés
  const absencesMap = absences.filter(a => ids.includes(a.eleveId));
  const sanctionsMap = sanctions.filter(s => ids.includes(s.eleveId));
  const notesMap = notes.filter(n => ids.includes(n.eleveId));
  const consultationMap = consultations.filter(n => ids.includes(n.eleveId));

  return {
    absences: absencesMap,
    sanctions: sanctionsMap,
    notes: notesMap,
    consultations: consultationMap,
  };
}

module.exports = { findDetailsByEleveIds };
