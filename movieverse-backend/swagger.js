import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MovieVerse REST API",
      version: "1.0.0",
      description: "Endpoints documentation",
      contact: {
        name: "Group 6 - MovieVerse",
        email: "",
      },
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "MovieVerse REST API",
      },
    ],
  },
  apis: ["./api-doc/movie.yaml",
        "./api-doc/select.yaml",
        "./api-doc/groups.yaml", 
        "./api-doc/profile.yaml",
        "./api-doc/favourite.yaml",
        "./api-doc/review.yaml",
        "./api-doc/groupDetail.yaml"], // Path to your routes files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use(
    "/api-doc",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true, withCredentials: false })
  );

  app.get("/swagger-json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default swaggerDocs;
