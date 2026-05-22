jest.mock("../models/Task", () => ({
  create: jest.fn(),
  findAll: jest.fn()
}));

jest.mock("../middleware/authMiddleware", () => ({
  authenticateToken: (req, _res, next) => {
    req.user = { id: 2, email: "staff@test.com", role: "staff" };
    next();
  },
  authorizeRoles: () => (_req, _res, next) => next()
}));

const request = require("supertest");
const app = require("../app");
const Task = require("../models/Task");

describe("POST /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("permite que staff cree una tarea asignada a admin", async () => {
    const taskPayload = {
      title: "Follow",
      assignee: "admin",
      dueDate: "2026-05-28",
      status: "pending",
      priority: "high",
      relatedTo: "Task"
    };

    Task.create.mockResolvedValue({ id: 1, ...taskPayload });

    const response = await request(app)
      .post("/api/tasks")
      .send(taskPayload);

    expect(response.statusCode).toBe(201);
    expect(Task.create).toHaveBeenCalledWith(taskPayload);
    expect(response.body.assignee).toBe("admin");
  });
});
