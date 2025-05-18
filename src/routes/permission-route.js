const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/persmission-controller");

router.post("/", permissionController.createPermission);              
router.get("/", permissionController.getAllPermission);              
router.get("/:id", permissionController.getPermissionById);           
router.delete("/:id", permissionController.deletePermission);        
router.put("/:id", permissionController.updatePermission);
router.get("/cour/:id", permissionController.getFindPermissionByCour);             

module.exports = router;
