/**
 * @openapi
 * /graduations/{id}:
 *   post:
 *     summary: Registrar uma nova graduação para um aluno
 *     tags:
 *       - Graduations
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno (UUID)
 *         example: "14d7ef79-e311-4cfa-9f20-ffc6c359f128"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - graduation_date
 *             properties:
 *               belt:
 *                 type: string
 *                 enum: [white, blue, purple, brown, black]
 *                 description: Nova faixa do aluno (opcional)
 *                 example: "blue"
 *
 *               grade:
 *                 type: integer
 *                 description: Grau alcançado (opcional)
 *                 example: 2
 *
 *               graduation_date:
 *                 type: string
 *                 format: date
 *                 description: Data da graduação
 *                 example: "2025-01-10"
 *
 *               studentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID do aluno (opcional no body, pois vem do path)
 *                 example: "14d7ef79-e311-4cfa-9f20-ffc6c359f128"
 *
 *     responses:
 *       201:
 *         description: Graduação registrada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Graduação registrada com sucesso!"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "d47df3f3-f250-4abc-9503-569e2d27f01a"
 *                     belt:
 *                       type: string
 *                       example: "blue"
 *                     grade:
 *                       type: integer
 *                       example: 2
 *                     graduation_date:
 *                       type: string
 *                       example: "2025-01-10T00:00:00.000Z"
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
 *                   example: "Erro interno no servidor"
 */
/**
 * @openapi
 * /graduations/{studentId}:
 *   get:
 *     summary: Listar todas as graduações de um aluno
 *     tags:
 *       - Graduations
 *
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno (UUID)
 *         example: "14d7ef79-e311-4cfa-9f20-ffc6c359f128"
 *
 *     responses:
 *       200:
 *         description: Lista de graduações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "d47df3f3-f250-4abc-9503-569e2d27f01a"
 *                   belt:
 *                     type: string
 *                     example: "blue"
 *                   grade:
 *                     type: integer
 *                     example: 2
 *                   graduation_date:
 *                     type: string
 *                     example: "10/01/2025"
 *                   studentId:
 *                     type: string
 *                     example: "14d7ef79-e311-4cfa-9f20-ffc6c359f128"
 *
 *       400:
 *         description: Erro de validação ou studentId ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "studentId não informado na URL."
 *
 *       500:
 *         description: Erro interno ao listar graduações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao listar graduações."
 */
