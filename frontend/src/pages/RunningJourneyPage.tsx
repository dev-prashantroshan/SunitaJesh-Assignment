import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Apple,
  ArrowRight,
  Bike,
  Footprints,
  HeartPulse,
  Menu,
  Mountain,
  Search,
  Sprout,
  Target,
  Weight,
} from "lucide-react";
import styles from "./RunningJourneyPage.module.css";
import { apiFetch } from "../utils/api";

interface CurrentRun {
  id: string;
  title: string;
  activityType: string;
  distanceKm: number;
  durationFormatted: string;
  calories: number;
  heartRateBpm: number;
  steps: number;
}

const reportText = "All your details in a single place";

function HeroHeader({ run }: { run: CurrentRun }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay}>
        <header className={styles.header}>
          <img className={styles.avatar} src="/assets/avatars/thomas.png" alt="Thomas" />
          <div className={styles.greeting}>
            <span>Hello,</span>
            <strong>Thomas</strong>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.headerButton} type="button" aria-label="Search">
              <Search size={25} strokeWidth={2.2} />
            </button>
            <span className={styles.headerDivider} />
            <button className={styles.headerButton} type="button" aria-label="Menu">
              <Menu size={27} strokeWidth={2.1} />
            </button>
          </div>
        </header>

        <div className={styles.summaryCard}>
          <div className={styles.metric}>
            <div className={styles.metricTitle}>
              <Weight size={16} strokeWidth={2.2} />
              <span>Weight</span>
            </div>
            <p>
              86.5 <span>kg</span>
            </p>
          </div>
          <span className={styles.metricDivider} />
          <div className={`${styles.metric} ${styles.stepMetric}`}>
            <div className={styles.metricTitle}>
              <Footprints size={17} strokeWidth={2.2} />
              <span>Step</span>
            </div>
            <p>
              {run.steps} <span>steps</span>
            </p>
          </div>
          <span className={styles.metricDivider} />
          <div className={`${styles.metric} ${styles.heartMetric}`}>
            <div className={styles.metricTitle}>
              <HeartPulse size={17} strokeWidth={2.2} />
              <span>Heart Rate</span>
            </div>
            <p>
              {run.heartRateBpm} <span>Bpm</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivityCarousel() {
  const navigate = useNavigate();
  const activities = [
    { label: "Running", icon: Footprints, selected: true, onClick: () => navigate("/running/activity") },
    { label: "Cycling", icon: Bike },
    { label: "Yoga", icon: Sprout },
    { label: "Fitness", icon: Target },
  ];

  return (
    <section className={styles.section}>
      <h2>What are you up to today?</h2>
      <div className={styles.activityRow}>
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <button
              key={activity.label}
              className={`${styles.activityCard} ${activity.selected ? styles.activitySelected : ""}`}
              type="button"
              onClick={activity.onClick}
            >
              <Icon size={28} strokeWidth={2.15} />
              <span>{activity.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function HabitCard({
  title,
  value,
  type,
}: {
  title: string;
  value: string;
  type: "goals" | "nutrition" | "challenges";
}) {
  const iconByType = {
    goals: Target,
    nutrition: Apple,
    challenges: Mountain,
  };
  const Icon = iconByType[type];

  return (
    <article className={styles.habitCard}>
      <div className={`${styles.habitIllustration} ${styles[type]}`}>
        <span className={styles.habitRing} />
        <span className={styles.habitCircle}>
          <Icon size={type === "challenges" ? 34 : 38} strokeWidth={2.2} />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}

function ReportHabitCard({ description }: { description: string }) {
  return (
    <article className={`${styles.habitCard} ${styles.reportHabit}`}>
      <h3>Daily Reports</h3>
      <p>{description}</p>
      <button className={styles.reportButton} type="button" aria-label="Open daily reports">
        <ArrowRight size={24} strokeWidth={2.4} />
      </button>
    </article>
  );
}

export function RunningJourneyPage() {
  const [run, setRun] = useState<CurrentRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRun = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/runs/current");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load current run");
      }

      setRun(result.data.run);
    } catch {
      setError("We couldn't load your running dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRun();
  }, []);

  if (loading) {
    return <p className={styles.message}>Loading running dashboard...</p>;
  }

  if (error || !run) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error || "Run not found."}</p>
          <button type="button" onClick={fetchRun}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <HeroHeader run={run} />
      <div className={styles.panel}>
        <ActivityCarousel />
        <section className={styles.section}>
          <h2>Your habits</h2>
          <div className={styles.habitsGrid}>
            <HabitCard title="Goals" value="73% achived" type="goals" />
            <HabitCard title="Nutrition" value="3 hours of fasting" type="nutrition" />
            <HabitCard title="Challenges" value="73% achived" type="challenges" />
            <ReportHabitCard description={reportText} />
          </div>
        </section>
      </div>
    </main>
  );
}
