import { Router as userRouter } from "express";
import { addUser, getUser, updateTime } from "./userController.js";

const router = userRouter();

/**
 * @swagger
 * paths:
 *  /api/user/user:
 *    get:
 *      summary: "해당 유저 데이터 조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Users]
 *      parameters:
 *        - in: query
 *          name: day
 *          required: true
 *          schema:
 *            type: integer
 *            description: 날짜
 *        - in: query
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *            description: 유저 id
 *      responses:
 *        "200":
 *          description: 해당 유저 정보 시간
 *          content:
 *            application/json:
 *              schema:
 *                type: object */
router.get("/user", getUser);

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
