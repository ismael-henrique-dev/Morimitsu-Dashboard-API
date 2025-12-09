/**
 * @openapi
 * /preferences:
 *   get:
 *     summary: Obter as preferências do sistema
 *     tags:
 *       - Preferences
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Preferências retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preferências encontradas"
 *                 preferences:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "b5c2a7da-0d12-4fc6-a23e-9f12ab21f003"
 *                     academy_name:
 *                       type: string
 *                       example: "Academia Dragão Branco"
 *                     max_students_per_class:
 *                       type: integer
 *                       example: 30
 *                     created_at:
 *                       type: string
 *                       example: "2025-01-01T12:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       example: "2025-02-10T16:45:00.000Z"
 *
 *       400:
 *         description: Erro de validação (Zod)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro de validação"
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */
/**
 * @openapi
 * /preferences/update/{id}:
 *   patch:
 *     summary: Atualizar a preferência de total de treinos
 *     tags:
 *       - Preferences
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "b5c2a7da-0d12-4fc6-a23e-9f12ab21f003"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalTrainings
 *             properties:
 *               totalTrainings:
 *                 type: number
 *                 example: 12
 *
 *     responses:
 *       200:
 *         description: Preferência atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Preferência atualizada com sucesso"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "b5c2a7da-0d12-4fc6-a23e-9f12ab21f003"
 *                     totalTrainings:
 *                       type: number
 *                       example: 12
 *                     created_at:
 *                       type: string
 *                       example: "2025-01-01T12:00:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       example: "2025-02-10T16:45:00.000Z"
 *
 *       400:
 *         description: Erro de validação (Zod)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro de validação"
 *                 issues:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor"
 */
