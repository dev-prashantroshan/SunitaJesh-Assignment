import request from "supertest";
import app from "../src/app";
import { HEALTH_OPTION_IDS, STEP_TYPES } from "../src/constants/onboarding.constants";
import { Journey } from "../src/models/Journey";
import { JourneyFavorite } from "../src/models/JourneyFavorite";
import { OnboardingAnswer } from "../src/models/OnboardingAnswer";
import { Run } from "../src/models/Run";
import { Step } from "../src/models/Step";

const deviceId = "device-thomas-001";

const seedSteps = async (): Promise<void> => {
  await Step.insertMany([
    {
      stepId: 2,
      title: "Sports selection",
      question: "First up, which sports do you enjoy the most?",
      helperText: "Select all that applies:",
      type: STEP_TYPES.MULTI_SELECT,
      minSelections: 1,
      maxSelections: 4,
      options: [
        { id: "basketball", label: "Basketball" },
        { id: "football", label: "Football" },
        { id: "tennis", label: "Tennis" },
        { id: "volleyball", label: "Volleyball" },
      ],
    },
    {
      stepId: 3,
      title: "Activity preferences",
      question: "Which sport activity gives the best workout?",
      helperText: "Select all that applies:",
      type: STEP_TYPES.MULTI_SELECT,
      minSelections: 1,
      maxSelections: 4,
      options: [
        { id: "strength-training", label: "Strength training" },
        { id: "cardio", label: "Cardio" },
        { id: "yoga", label: "Yoga" },
        { id: "low-impact-exercise", label: "Low Impact exercise" },
      ],
    },
    {
      stepId: 4,
      title: "Training location",
      question: "Where do you enjoy the most to train?",
      helperText: "Select one option:",
      type: STEP_TYPES.SINGLE_SELECT,
      minSelections: 1,
      maxSelections: 1,
      options: [{ id: "outdoor", label: "Outdoor" }],
    },
    {
      stepId: 5,
      title: "Training frequency",
      question: "How often do you train?",
      helperText: "Select what fits best:",
      type: STEP_TYPES.SINGLE_SELECT,
      minSelections: 1,
      maxSelections: 1,
      options: [{ id: "1-time-per-week", label: "1 time per week" }],
    },
    {
      stepId: 6,
      title: "Health problems",
      question: "Do you have any health problems that can affect your trainings?",
      helperText: "Select what fits best:",
      type: STEP_TYPES.YES_NO,
      minSelections: 1,
      maxSelections: 1,
      allowDetails: true,
      detailsMaxLength: 250,
      options: [
        { id: HEALTH_OPTION_IDS.HEALTH_NO, label: "No, I don't have" },
        { id: HEALTH_OPTION_IDS.HEALTH_YES, label: "Yes, I have" },
      ],
    },
    {
      stepId: 7,
      title: "Diet type",
      question: "What's your diet type?",
      helperText: "Select what fits best:",
      type: STEP_TYPES.SINGLE_SELECT,
      minSelections: 1,
      maxSelections: 1,
      options: [{ id: "standard", label: "Standard" }],
    },
    {
      stepId: 8,
      title: "Improvement goal",
      question: "What do you want to improve?",
      helperText: "Select all that apply:",
      type: STEP_TYPES.MULTI_SELECT,
      minSelections: 1,
      maxSelections: 4,
      options: [
        { id: "reduce-stress", label: "Reduce stress" },
        { id: "improve-sleep", label: "Improve sleep" },
        { id: "build-strength", label: "Build strength" },
        { id: "lose-weight", label: "Lose weight" },
      ],
    },
  ]);
};

describe("Backend API integration", () => {
  it("GET /api/steps returns Steps 2 through 8", async () => {
    await seedSteps();

    const response = await request(app).get("/api/steps");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.steps).toHaveLength(7);
    expect(response.body.data.steps.map((step: { stepId: number }) => step.stepId)).toEqual([
      2, 3, 4, 5, 6, 7, 8,
    ]);
  });

  it("PUT /api/onboarding/answers/2 saves a valid answer and returns progress", async () => {
    await seedSteps();

    const response = await request(app)
      .put("/api/onboarding/answers/2")
      .set("x-device-id", deviceId)
      .send({ selectedOptionIds: ["basketball", "football"] });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.answer.selectedOptionIds).toEqual(["basketball", "football"]);
    expect(response.body.data.progress).toMatchObject({
      completedSteps: 1,
      totalSteps: 7,
      progressPercentage: 14,
      nextStep: 3,
      isCompleted: false,
    });
  });

  it("PUT /api/onboarding/answers/2 rejects an invalid option id", async () => {
    await seedSteps();

    const response = await request(app)
      .put("/api/onboarding/answers/2")
      .set("x-device-id", deviceId)
      .send({ selectedOptionIds: ["bad-option"] });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_OPTION");
  });

  it("PUT /api/onboarding/answers/8 saves multiple improvement goals", async () => {
    await seedSteps();

    const selectedOptionIds = ["reduce-stress", "improve-sleep", "build-strength", "lose-weight"];
    const response = await request(app)
      .put("/api/onboarding/answers/8")
      .set("x-device-id", deviceId)
      .send({ selectedOptionIds, details: "" });

    const storedAnswer = await OnboardingAnswer.findOne({ deviceId, stepId: 8 }).lean();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.answer.selectedOptionIds).toEqual(selectedOptionIds);
    expect(storedAnswer?.selectedOptionIds).toEqual(selectedOptionIds);
  });

  it("PUT /api/onboarding/answers/8 requires at least one improvement goal", async () => {
    await seedSteps();

    const response = await request(app)
      .put("/api/onboarding/answers/8")
      .set("x-device-id", deviceId)
      .send({ selectedOptionIds: [], details: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_SELECTION_COUNT");
  });

  it.each([undefined, "", "   "])(
    "PUT /api/onboarding/answers/6 rejects missing or blank details when health-yes is selected",
    async (details) => {
      await seedSteps();

      const response = await request(app)
        .put("/api/onboarding/answers/6")
        .set("x-device-id", deviceId)
        .send({
          selectedOptionIds: [HEALTH_OPTION_IDS.HEALTH_YES],
          ...(details !== undefined ? { details } : {}),
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("DETAILS_REQUIRED");
    }
  );

  it("PUT /api/onboarding/answers/6 rejects details longer than 250 characters", async () => {
    await seedSteps();

    const response = await request(app)
      .put("/api/onboarding/answers/6")
      .set("x-device-id", deviceId)
      .send({
        selectedOptionIds: [HEALTH_OPTION_IDS.HEALTH_YES],
        details: "a".repeat(251),
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("DETAILS_TOO_LONG");
  });

  it("PUT /api/onboarding/answers/6 clears previous details when health-no is selected", async () => {
    await seedSteps();

    await request(app)
      .put("/api/onboarding/answers/6")
      .set("x-device-id", deviceId)
      .send({
        selectedOptionIds: [HEALTH_OPTION_IDS.HEALTH_YES],
        details: "Previous health details",
      })
      .expect(200);

    const response = await request(app)
      .put("/api/onboarding/answers/6")
      .set("x-device-id", deviceId)
      .send({
        selectedOptionIds: [HEALTH_OPTION_IDS.HEALTH_NO],
        details: "",
      });

    const storedAnswer = await OnboardingAnswer.findOne({ deviceId, stepId: 6 }).lean();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.answer.selectedOptionIds).toEqual([HEALTH_OPTION_IDS.HEALTH_NO]);
    expect(response.body.data.answer.details).toBeUndefined();
    expect(storedAnswer?.details).toBeUndefined();
  });

  it("POST /api/journeys/:id/favorite is idempotent", async () => {
    const journey = await Journey.create({
      title: "Reduce Stress",
      description: "A calming plan for daily recovery.",
      category: "Wellness",
      imageUrl: "/assets/journeys/reduce-stress.png",
      durationWeeks: 4,
      difficulty: "Beginner",
      activities: ["Breathing"],
      benefits: ["Lower stress"],
      featured: true,
    });

    const firstResponse = await request(app)
      .post(`/api/journeys/${journey._id}/favorite`)
      .set("x-device-id", deviceId);
    const secondResponse = await request(app)
      .post(`/api/journeys/${journey._id}/favorite`)
      .set("x-device-id", deviceId);
    const favoriteCount = await JourneyFavorite.countDocuments({
      deviceId,
      journeyId: journey._id,
    });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(firstResponse.body.data.isFavorite).toBe(true);
    expect(secondResponse.body.data.isFavorite).toBe(true);
    expect(favoriteCount).toBe(1);
  });

  it("GET /api/runs/:id returns RUN_NOT_FOUND for another device", async () => {
    const run = await Run.create({
      deviceId,
      title: "Morning Park Run",
      activityType: "running",
      distanceKm: 3.2,
      durationSeconds: 1140,
      calories: 240,
      heartRateBpm: 136,
      steps: 4200,
      startedAt: new Date("2026-07-12T07:00:00.000Z"),
      route: [{ latitude: 51.5007, longitude: -0.1246, order: 1 }],
    });

    const response = await request(app)
      .get(`/api/runs/${run._id}`)
      .set("x-device-id", "another-device-001");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("RUN_NOT_FOUND");
  });

  it("GET /api/runs/current provisions a seeded demo run for a new device", async () => {
    await Run.create({
      deviceId,
      title: "Morning Park Run",
      activityType: "running",
      distanceKm: 3.2,
      durationSeconds: 1140,
      calories: 240,
      heartRateBpm: 136,
      steps: 4200,
      startedAt: new Date("2026-07-12T07:00:00.000Z"),
      route: [{ latitude: 51.5007, longitude: -0.1246, order: 1 }],
    });

    const newDeviceId = "new-browser-device";
    const response = await request(app)
      .get("/api/runs/current")
      .set("x-device-id", newDeviceId);
    const provisionedRun = await Run.findOne({ deviceId: newDeviceId }).lean();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.run.title).toBe("Morning Park Run");
    expect(provisionedRun?.deviceId).toBe(newDeviceId);
    expect(provisionedRun?.route).toHaveLength(1);
  });
});
