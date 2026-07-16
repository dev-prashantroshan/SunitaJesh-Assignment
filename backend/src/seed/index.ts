import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Journey } from "../models/Journey";
import { JourneyFavorite } from "../models/JourneyFavorite";
import { OnboardingAnswer } from "../models/OnboardingAnswer";
import { Run } from "../models/Run";
import { Step } from "../models/Step";
import { HEALTH_OPTION_IDS, STEP_TYPES } from "../constants/onboarding.constants";

const deviceId = "device-thomas-001";

const steps = [
  {
    stepId: 2,
    title: "Sports selection",
    question: "First up, which sports do you enjoy the most?",
    helperText: "Select all that applies:",
    type: STEP_TYPES.MULTI_SELECT,
    minSelections: 1,
    maxSelections: 4,
    options: [
      {
        id: "basketball",
        label: "Basketball",
        metadata: { availablePractices: ["shooting", "dribbling", "conditioning"] },
      },
      {
        id: "football",
        label: "Football",
        metadata: { availablePractices: ["passing", "sprints", "footwork"] },
      },
      {
        id: "tennis",
        label: "Tennis",
        metadata: { availablePractices: ["serves", "rallies", "agility"] },
      },
      {
        id: "volleyball",
        label: "Volleyball",
        metadata: { availablePractices: ["serving", "jumping", "reaction"] },
      },
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
    options: [
      { id: "outdoor", label: "Outdoor" },
      { id: "indoor", label: "Indoor" },
      { id: "home", label: "Home" },
      { id: "at-the-gym", label: "At the gym" },
      { id: "in-the-park", label: "In the park" },
    ],
  },
  {
    stepId: 5,
    title: "Training frequency",
    question: "How often do you train?",
    helperText: "Select what fits best:",
    type: STEP_TYPES.SINGLE_SELECT,
    minSelections: 1,
    maxSelections: 1,
    options: [
      { id: "1-time-per-week", label: "1 time per week" },
      { id: "2-times-per-week", label: "2 times per week" },
      { id: "3-times-per-week", label: "3 times per week" },
      { id: "more-than-3-times-per-week", label: "more than 3 times per week" },
    ],
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
    options: [
      {
        id: "standard",
        label: "Standard",
        description: "Nothing special",
      },
      {
        id: "pescetarian",
        label: "Pescetarian",
        description: "No meat, but fish",
      },
      {
        id: "vegetarian",
        label: "Vegetarian",
        description: "No meat",
      },
      {
        id: "vegan",
        label: "Vegan",
        description: "No animal products",
      },
    ],
  },
  {
    stepId: 8,
    title: "Improvement goal",
    question: "What do you want to improve?",
    helperText: "Select one option:",
    type: STEP_TYPES.SINGLE_SELECT,
    minSelections: 1,
    maxSelections: 1,
    options: [
      { id: "reduce-stress", label: "Reduce stress" },
      { id: "improve-sleep", label: "Improve sleep" },
      { id: "build-strength", label: "Build strength" },
      { id: "lose-weight", label: "Lose weight" },
    ],
  },
];

const journeys = [
  {
    title: "Reduce Stress",
    description: "A calming plan with light movement, breathing routines and simple recovery habits.",
    category: "Wellness",
    imageUrl: "/assets/journeys/reduce-stress.png",
    durationWeeks: 4,
    difficulty: "Beginner",
    activities: ["Breathing", "Yoga", "Walking"],
    benefits: ["Lower daily stress", "Better focus", "Improved recovery"],
    featured: true,
  },
  {
    title: "Improve Sleep",
    description: "Evening-friendly routines designed to help the body wind down and sleep more consistently.",
    category: "Recovery",
    imageUrl: "/assets/journeys/improve-sleep.png",
    durationWeeks: 3,
    difficulty: "Beginner",
    activities: ["Stretching", "Breathing", "Light mobility"],
    benefits: ["More consistent sleep", "Less restlessness", "Better nighttime routine"],
    featured: true,
  },
  {
    title: "Beginner Running Plan",
    description: "A steady running plan for building confidence, endurance and a repeatable weekly habit.",
    category: "Cardio",
    imageUrl: "/assets/journeys/beginner-running-plan.png",
    durationWeeks: 6,
    difficulty: "Beginner",
    activities: ["Running", "Walking intervals", "Mobility"],
    benefits: ["Improved stamina", "Stronger cardio base", "Better pacing"],
    featured: false,
  },
  {
    title: "Strength Builder",
    description: "A practical strength journey focused on controlled movements and full-body progress.",
    category: "Strength",
    imageUrl: "/assets/journeys/strength-builder.png",
    durationWeeks: 8,
    difficulty: "Intermediate",
    activities: ["Strength training", "Core work", "Mobility"],
    benefits: ["Build strength", "Improve posture", "Increase training consistency"],
    featured: false,
  },
];

const runs = [
  {
    deviceId,
    title: "Running to Hyde Park",
    activityType: "running",
    distanceKm: 4.8,
    durationSeconds: 1680,
    calories: 360,
    heartRateBpm: 142,
    steps: 6100,
    startedAt: new Date("2026-07-10T06:30:00.000Z"),
    route: [
      { latitude: 51.5074, longitude: -0.1657, order: 1 },
      { latitude: 51.5082, longitude: -0.1689, order: 2 },
      { latitude: 51.5095, longitude: -0.1719, order: 3 },
      { latitude: 51.5108, longitude: -0.1744, order: 4 },
      { latitude: 51.5116, longitude: -0.1768, order: 5 },
    ],
  },
  {
    deviceId,
    title: "Morning Park Run",
    activityType: "running",
    distanceKm: 3.2,
    durationSeconds: 1140,
    calories: 240,
    heartRateBpm: 136,
    steps: 4200,
    startedAt: new Date("2026-07-12T07:00:00.000Z"),
    route: [
      { latitude: 51.5007, longitude: -0.1246, order: 1 },
      { latitude: 51.5016, longitude: -0.1261, order: 2 },
      { latitude: 51.5024, longitude: -0.1283, order: 3 },
      { latitude: 51.5031, longitude: -0.1302, order: 4 },
    ],
  },
];

const seed = async (): Promise<void> => {
  try {
    await connectDB();

    await Promise.all([
      Step.deleteMany({}),
      OnboardingAnswer.deleteMany({}),
      Journey.deleteMany({}),
      JourneyFavorite.deleteMany({}),
      Run.deleteMany({}),
    ]);

    await Step.insertMany(steps);
    await Journey.insertMany(journeys);
    await Run.insertMany(runs);

    console.log("Seed completed");
  } catch (error) {
    console.error("Seed failed", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
