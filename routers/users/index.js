import { Router as userRouter } from "express";
import { addUser, getUser, getUsers, updateTime } from "./userController.js";

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
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
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
 * paths:
 *  /api/user/users:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보 및 시간
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    users:
 *                      type: object
 *                      example:
 *                         [
 *                             {
 *                                   "member_id": 5,
 *                                    "api_key": "OTQ4MmM2ZWItNTkxZi00OGM0LThhYzgtYzcxNWM4MjdiYWRh",
 *                                    "last_7_days": "21:0",
 *                                    "username": "박성훈",
 *                                    "last_14_days": "31:51",
 *                                    "last_30_days": "56:10",
 *                                    "updated_time_7days": "2022-11-16T12:12:20.000Z",
 *                                    "updated_time_14days": "2022-11-16T12:03:20.000Z",
 *                                    "updated_time_30days": "2022-11-16T02:34:55.000Z",
 *                                    "Organization": "Megabrain"
 *                                },
 *                                {
 *                                    "member_id": 7,
 *                                    "api_key": "YmIyYWQzMTgtNGE2ZC00NWY3LWI3ZmItMmFlN2E3MGU5ZmU4",
 *                                    "last_7_days": "17:15",
 *                                    "username": "이나린",
 *                                    "last_14_days": "25:6",
 *                                    "last_30_days": "67:40",
 *                                    "updated_time_7days": "2022-11-16T12:12:21.000Z",
 *                                    "updated_time_14days": "2022-11-16T12:03:20.000Z",
 *                                    "updated_time_30days": "2022-11-16T02:34:56.000Z",
 *                                    "Organization": "Megabrain"
 *                                },
 *                                {
 *                                    "member_id": 8,
 *                                    "api_key": "NjczMDA5ZTQtZTMwMS00YTFjLWFiNGItNmNmNWNlOGZkMDg2",
 *                                    "last_7_days": "19:44",
 *                                    "username": "박영건",
 *                                    "last_14_days": "41:3",
 *                                    "last_30_days": "58:4",
 *                                    "updated_time_7days": "2022-11-16T12:12:22.000Z",
 *                                    "updated_time_14days": "2022-11-16T12:03:21.000Z",
 *                                    "updated_time_30days": "2022-11-16T02:34:56.000Z",
 *                                    "Organization": "Megabrain"
 *                                }
 *                            ] */
router.get("/users", getUsers);

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
