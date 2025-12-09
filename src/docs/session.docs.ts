/**
 * @openapi
 * /sessions:
 *   post:
 *     summary: Criar uma nova sessão de treino
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - session_date
 *             properties:
 *               class_id:
 *                 type: string
 *                 format: uuid
 *                 example: "8ad64d53-f160-4e49-a314-f47dc55d2af2"
 *
 *               session_date:
 *                 type: string
 *                 description: Data da sessão (ISO string)
 *                 example: "2025-01-10T14:30:00.000Z"
 *
 *               instructorId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Ignorado — ID do instrutor é extraído do token
 *
 *     responses:
 *       201:
 *         description: Sessão criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sessão criada com sucesso!"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "51c93b62-0f8d-4ccf-a1fd-dc45a5f0d531"
 *
 *                     instructorId:
 *                       type: string
 *                       example: "c77d7c06-8be6-4e8a-b889-cf9d39fdaf34"
 *
 *                     class_id:
 *                       type: string
 *                       example: "8ad64d53-f160-4e49-a314-f47dc55d2af2"
 *
 *                     session_date:
 *                       type: string
 *                       description: Data formatada
 *                       example: "2025-01-10, 14:30"
 *
 *       400:
 *         description: Erro de validação do corpo da requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format"
 *
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token necessário"
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
