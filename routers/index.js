import { Router as routers } from "express";
import user from "./users/index.js";

const router = routers();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */
router.use("/user", user);

export default router;
