import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  restablecerPassword,
  comprobarToken,
  nuevoPassword,
  perfil
} from "../controllers/usuarioControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Autenticacion, registro y Confirmacion de usuario
router.post("/", registrar); // Registro de usuario
router.post("/login", autenticar); // Autenticacion de usuario
router.get("/confirmar/:token", confirmar); // Confirmacion de usuario
router.post("/olvide-password", restablecerPassword); // Restablecer contraseña
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.get("/perfil", checkAuth, perfil)

export default router;
