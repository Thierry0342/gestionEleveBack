const { DataTypes } = require("sequelize");
const sequelize = require("../data-access/database-connection");

/**
 * Modèle Cadre — reproduit la structure de la "FICHE INDIVIDUELLE" (Gendarmerie Nationale)
 *
 * Les sections répétables du PDF (enfants, grades successifs, décorations, félicitations,
 * punitions, diplômes, serments, affectations successives, relations gênantes) sont stockées
 * en colonnes JSON (tableaux d'objets). Cela évite de créer 10 tables associées + 10 CRUD,
 * tout en gardant la structure fidèle au document. Si tu préfères des tables relationnelles
 * séparées (plus propre pour filtrer/rechercher dans ces sous-données), on peut migrer plus tard.
 */
const CadreSchema = sequelize.define("Cadre", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // ===== IDENTIFICATION =====
  matricule: { type: DataTypes.STRING, allowNull: true, unique: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  // Chemin relatif de la photo, ex: "/uploads/cadres/1690000000-photo.jpg"
  // Servi en statique par express.static (voir server.js) — construire l'URL complète
  // côté front avec API_URL + photo.
  photo: { type: DataTypes.STRING, allowNull: true },

  // Position effective
  positionEffectiveUnite: { type: DataTypes.STRING, allowNull: true },
  positionEffectiveFonction: { type: DataTypes.STRING, allowNull: true },
  positionEffectiveDepuisLe: { type: DataTypes.STRING, allowNull: true },
  positionEffectiveDisponibleLe: { type: DataTypes.STRING, allowNull: true },

  // Position théorique
  positionTheoriqueUnite: { type: DataTypes.STRING, allowNull: true },
  positionTheoriqueFonction: { type: DataTypes.STRING, allowNull: true },
  positionTheoriqueDepuisLe: { type: DataTypes.STRING, allowNull: true },
  positionTheoriqueDisponibleLe: { type: DataTypes.STRING, allowNull: true },

  // Grade / service courants (utilisés pour la liste/tableau principal)
  grade: { type: DataTypes.STRING, allowNull: true },
  service: { type: DataTypes.STRING, allowNull: true },

  // ===== I - ETAT CIVIL =====
  dateNaissance: { type: DataTypes.STRING, allowNull: true },
  lieuNaissance: { type: DataTypes.STRING, allowNull: true },
  sexe: { type: DataTypes.STRING, allowNull: true },
  groupeSanguin: { type: DataTypes.STRING, allowNull: true },
  taille: { type: DataTypes.STRING, allowNull: true },
  pereNomPrenom: { type: DataTypes.STRING, allowNull: true },
  mereNomPrenom: { type: DataTypes.STRING, allowNull: true },
  groupeEthnique: { type: DataTypes.STRING, allowNull: true },
  religion: { type: DataTypes.STRING, allowNull: true },
  cin: { type: DataTypes.STRING, allowNull: true },
  cinDelivreLe: { type: DataTypes.STRING, allowNull: true },
  cinDelivreA: { type: DataTypes.STRING, allowNull: true },

  dateMariage: { type: DataTypes.STRING, allowNull: true },
  autorisationMariage: { type: DataTypes.STRING, allowNull: true },
  mariageRompuLe: { type: DataTypes.STRING, allowNull: true },
  motifRompuMariage: { type: DataTypes.STRING, allowNull: true },
  remarieLe: { type: DataTypes.STRING, allowNull: true },
  deuxiemeAutorisationMariage: { type: DataTypes.STRING, allowNull: true },
  numeroDateJugementDeces: { type: DataTypes.STRING, allowNull: true },

  // ===== II - EPOUX(SE) ACTUEL(LE) =====
  epouxNomPrenom: { type: DataTypes.STRING, allowNull: true },
  epouxFonction: { type: DataTypes.STRING, allowNull: true },
  epouxMatricule: { type: DataTypes.STRING, allowNull: true },
  epouxCin: { type: DataTypes.STRING, allowNull: true },
  epouxOrganismeEmployeur: { type: DataTypes.STRING, allowNull: true },
  epouxRefDecisionIncorporation: { type: DataTypes.STRING, allowNull: true },
  epouxDelivreLe: { type: DataTypes.STRING, allowNull: true },
  epouxDelivreA: { type: DataTypes.STRING, allowNull: true },

  // ===== V - SERVICES DANS LA GENDARMERIE NATIONALE =====
  dateIncorporation: { type: DataTypes.STRING, allowNull: true },
  diplomeDecisionIncorporation: { type: DataTypes.STRING, allowNull: true },

  // ===== Pied de page =====
  nombrePiecesJointes: { type: DataTypes.STRING, allowNull: true },
  nombreFeuillesSupplementaires: { type: DataTypes.STRING, allowNull: true },

  // ===== III - ENFANTS =====
  // [{ numero, nomPrenom, dateNaissance, lieuNaissance, qualite, sexe, observation }]
  enfants: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== IV - SERVICES MILITAIRE EFFECTUE =====
  // [{ typeService, dateDebut, dateFin, promoClasse, mleSN }]
  servicesMilitaires: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== VI - GRADES SUCCESSIFS =====
  // [{ grade, dateNomination, refDecision }]
  gradesSuccessifs: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== VII - DECORATIONS SUCCESSIVES =====
  // [{ nature, refAttribution, datePriseEffet }]
  decorations: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== VIII - FELICITATIONS =====
  // [{ nature, reference, libelle, autorite }]
  felicitations: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== IX - PUNITIONS =====
  // [{ taux, type, dpe, autoriteInfligeante, reference, libelle }]
  punitions: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== X - DIPLOMES ET BREVETS =====
  // [{ intitule, reference, entite, categorie }]  categorie: "Civil" | "Militaire"
  diplomes: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== XI - SERMENTS =====
  // [{ typePrestation, datePrestation, lieu, observations }]
  serments: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== XII - AFFECTATIONS SUCCESSIVES =====
  // [{ unite, fonction, acDuLe, refDecision, motif, dateDisponibilite, referenceCR }]
  affectations: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },

  // ===== XIII - RENSEIGNEMENTS SANITAIRES =====
  // { reference, medecinTraitant, nombrePATC, dateDebutPATC, renouvelable }
  sanitairePATC: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },
  // { reference, type, referenceEnvoiCREFA, referenceEnvoiFinance, observation }
  sanitaireCREFA: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },

  // ===== XIV - RELATIONS OU INTERETS GENANTS =====
  // [{ type, districtRegion }]
  relationsInterets: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
});

module.exports = CadreSchema;
