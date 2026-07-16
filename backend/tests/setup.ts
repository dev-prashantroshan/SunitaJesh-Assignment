import dotenv from "dotenv";
import mongoose from "mongoose";
import { Journey } from "../src/models/Journey";
import { JourneyFavorite } from "../src/models/JourneyFavorite";
import { OnboardingAnswer } from "../src/models/OnboardingAnswer";
import { Run } from "../src/models/Run";
import { Step } from "../src/models/Step";

dotenv.config();

process.env.NODE_ENV = "test";

const clearAssessmentCollections = async (): Promise<void> => {
  await Promise.all([
    Step.deleteMany({}),
    OnboardingAnswer.deleteMany({}),
    Journey.deleteMany({}),
    JourneyFavorite.deleteMany({}),
    Run.deleteMany({}),
  ]);
};

beforeAll(async () => {
  const testUri = process.env.MONGODB_TEST_URI;

  if (!testUri) {
    throw new Error("MONGODB_TEST_URI is required for tests");
  }

  if (testUri === process.env.MONGODB_URI) {
    throw new Error("MONGODB_TEST_URI must not match MONGODB_URI");
  }

  await mongoose.connect(testUri);
  await clearAssessmentCollections();
});

beforeEach(async () => {
  await clearAssessmentCollections();
});

afterAll(async () => {
  await clearAssessmentCollections();
  await mongoose.connection.close();
});
