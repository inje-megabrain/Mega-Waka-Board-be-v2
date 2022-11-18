import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "wakaboard swagger",
      description: "와카타임 리더보드 프로젝트",
    },
    servers: [
      {
        url: "http://203.241.228.50:18083", // 요청 URL
      },
      {
        url: "http://localhost:18083", // 요청 URL
      },
    ],
  },
  apis: ["./routers/*.js", "./routers/users/*.js"], //Swagger 파일 연동
};
const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
