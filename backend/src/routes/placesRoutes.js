import express from 'express';
import { getMunicipios, searchHealthUnits } from '../controllers/placesController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Locais
 *   description: Endpoints referentes a municípios e unidades de saúde
 */

/**
 * @swagger
 * /api/municipios:
 *   get:
 *     summary: Lista de municípios suportados (MA)
 *     tags: [Locais]
 *     responses:
 *       200:
 *         description: Array de municípios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/municipios', getMunicipios);

/**
 * @swagger
 * /api/health-units:
 *   get:
 *     summary: Busca unidades de saúde por município e categoria
 *     tags: [Locais]
 *     parameters:
 *       - in: query
 *         name: municipio
 *         schema:
 *           type: string
 *         example: São Luís
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: Clínica General
 *     responses:
 *       200:
 *         description: Objetos agrupados por município
 *       400:
 *         description: Parâmetros incorretos
 */
router.get('/health-units', searchHealthUnits);

export default router;