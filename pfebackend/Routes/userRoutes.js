const express = require("express");
const router = express.Router();
const blogController = require("../controllers/Blog_controllers")
const userController = require("../controllers/controllers");
const tableDataController = require("../controllers/Ouverture")
const Evaluation = require("../controllers/Evaluation")
const tableController = require("../controllers/DynamicTable")

router.post('/save', userController.saveData);
router.get('/data', userController.getData);
router.put('/data/:productId', userController.updateProduct);
router.delete('/data/:productId', userController.deleteProduct);
router.post("/login", userController.checkUser);
router.post("/register", userController.signupUser);
router.post("/createUserFromAdmin", userController.adminSignupUser);
router.get("/getLibelle", userController.getCodeLibelle);
router.post("/items", userController.createItem);
router.get("/getItems", userController.getItems);
router.delete('/items/:itemId', userController.deleteItem);
router.put('/items/:itemId', userController.updateItem);
router.post('/saveBlog', blogController.saveBlog);
router.get('/getBlog', blogController.getBlog);
router.put('/updateBlog/:id', blogController.updateBlog);
router.delete('/deleteBlog/:id', blogController.deleteBlog);
router.get('/pending-users', userController.getPendingUsers);
router.post('/saveAnnonce', userController.createAnnonce)
router.get('/getAnnonce', userController.GetAnnonce)
router.delete('/deleteAnnonce/:id', userController.deleteAnnonce)
router.put("/user/:userId/accept", userController.acceptUser);
router.delete("/user/:userId", userController.deleteUser);
router.get('/users-with-role-user', userController.getUsersByRole);
router.get('/deleted-users', userController.getDeletedUsers);
router.put("/user/:userId/delete", userController.markUserAsDeleted);
router.put("/user/:userId/rmdelete", userController.markUserAsRmDeleted);
router.post('/:projectName/ouverture', tableDataController.addRow);
router.get('/:projectName/ouverture', tableDataController.getRows);
router.put('/:projectName/ouverture/:id', tableDataController.updateRow);
router.delete('/:projectName/ouverture', tableDataController.deleteRow);
router.get("/:projectName/getevaluation", Evaluation.getEvaluations);
router.post("/:projectName/putevaluation", Evaluation.createEvaluation);
router.put("/:projectName/evaluation/:id", Evaluation.updateEvaluation);
router.delete("/:projectName/evaluation/:id", Evaluation.deleteEvaluation);
router.post("/dataEvaluation", tableController.createProject);
router.get("/dataEvaluation", tableController.getProjects);
router.put("/dataEvaluation/:id", tableController.updateProject);
router.delete("/dataEvaluation/:id", tableController.deleteProject);

module.exports = router;