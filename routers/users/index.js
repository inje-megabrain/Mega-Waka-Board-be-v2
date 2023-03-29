import { Router as userRouter } from "express";
import { addUser, updateTime } from "./userController.js";

const router = userRouter();

/**
 * @swagger
 *  /api/user/update:
 *    post:
 *      tags: [Users]
 *      description: 유저 데이터 갱신 param(7, 14, 30)
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: updateDay
 *          required: true
 *          default: 7
 *          schema:
 *            type: integer
 *            description: 날짜 param (7, 14, 30)
 *      responses:
 *       200:
 *        description: 유저 업데이트 성공
 */
router.post("/update", updateTime);

/**
 * @swagger
 *  /api/user/add-user:
 *    post:
 *      tags: [Users]
 *      description: 유저 추가 api
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: username
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: apikey
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: organization
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *       200:
 *        description: 유저 업데이트 성공
 */
router.post("/add-user", addUser);
export default router;
