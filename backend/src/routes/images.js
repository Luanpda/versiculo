import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
// Recebe a imagem em memória antes de enviá-la ao Cloudinary ou S3.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) =>
    callback(null, file.mimetype.startsWith("image/")),
});

// Ponto de extensão para Cloudinary/S3. Não deixa arquivos soltos no servidor.
router.post("/", requireAuth, upload.single("image"), (request, response) => {
  if (!request.file)
    return response
      .status(400)
      .json({ message: "Envie uma imagem válida de até 5 MB." });
  response.status(501).json({
    message: "Configure Cloudinary ou S3 nesta rota para salvar a imagem.",
    filename: request.file.originalname,
  });
});

export default router;
