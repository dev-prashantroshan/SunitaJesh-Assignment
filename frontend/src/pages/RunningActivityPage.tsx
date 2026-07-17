import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Expand,
  Flame,
  Footprints,
  HeartPulse,
  Menu,
  Sprout,
} from "lucide-react";
import styles from "./RunningActivityPage.module.css";
import { apiFetch } from "../utils/api";

interface CurrentRun {
  id: string;
  distanceKm: number;
  durationFormatted: string;
  calories: number;
  heartRateBpm: number;
  steps: number;
}

function HabitMetricCard({
  title,
  value,
  unit,
  icon,
  selected = false,
}: {
  title: string;
  value: string | number;
  unit: string;
  icon: "calories" | "heart" | "steps";
  selected?: boolean;
}) {
  const iconByType = {
    calories: Flame,
    heart: HeartPulse,
    steps: Footprints,
  };
  const Icon = iconByType[icon];

  return (
    <article className={`${styles.metricCard} ${selected ? styles.metricSelected : ""}`}>
      <span className={styles.metricIcon}>
        <Icon size={22} strokeWidth={2.25} />
      </span>
      <h3>{title}</h3>
      <div className={styles.graph} aria-hidden="true">
        <svg viewBox="0 0 160 72" preserveAspectRatio="none">
          <path d="M0 58 C16 58 16 28 32 28 C48 28 44 54 61 54 C78 54 69 10 86 10 C102 10 97 43 115 43 C132 43 130 20 145 20 C154 20 158 33 160 37 L160 72 L0 72 Z" />
        </svg>
      </div>
      <p>
        {value} <span>{unit}</span>
      </p>
    </article>
  );
}

export function RunningActivityPage() {
  const navigate = useNavigate();
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
      setError("We couldn't load your running activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRun();
  }, []);

  const openRoute = () => {
    navigate("/running/route");
  };

  if (loading) {
    return <p className={styles.message}>Loading activity...</p>;
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
      <header className={styles.topNav}>
        <button
          className={styles.backButton}
          type="button"
          aria-label="Back"
          onClick={() => navigate("/journey/running")}
        >
          <ArrowLeft size={23} strokeWidth={2.1} />
        </button>
        <span className={styles.navDivider} />
        <h1>Activity tracking</h1>
        <span className={styles.badge}>Running</span>
        <button className={styles.menuButton} type="button" aria-label="Menu">
          <Menu size={25} strokeWidth={2.1} />
        </button>
      </header>

      <section className={styles.heroText}>
        <h2>Enjoy your running routine</h2>
        <button className={styles.dateButton} type="button">
          <CalendarDays size={19} strokeWidth={2.2} />
          <span>Today, 5 March 2023</span>
          <ChevronDown size={20} strokeWidth={2.2} />
        </button>
      </section>

      <section className={styles.mapSection}>
        <button className={styles.mapButton} type="button" onClick={openRoute} aria-label="Open route">
          <img className={styles.mapImage} src="/assets/maps/map.png" alt="Running route map" />
          <img className={styles.mapPin} src="/assets/maps/map-pin.png" alt="" />
        </button>
        <button className={styles.expandButton} type="button" onClick={openRoute} aria-label="Expand map">
          <Expand size={24} strokeWidth={2.35} />
        </button>
        <article className={styles.runSummary}>
          <div className={styles.routeLine} aria-hidden="true">
            <span />
          </div>
          <div className={styles.runDetails}>
            <div className={styles.runTitle}>
              <span>⏱</span>
              <strong>Today Run</strong>
            </div>
            <p>
              {run.distanceKm} <span>km</span>
              <i />
              {run.durationFormatted.replace(/^0/, "")} <span>time</span>
            </p>
          </div>
          <ChevronRight className={styles.chevron} size={27} strokeWidth={2.2} />
        </article>
      </section>

      <section className={styles.habitsSection}>
        <div className={styles.habitsHeader}>
          <h2>Your habits</h2>
          <button type="button">
            See all <ArrowRight size={22} strokeWidth={2.4} />
          </button>
        </div>
        <div className={styles.habitsRow}>
          <HabitMetricCard title="Calories Burn" value={run.calories} unit="kcal" icon="calories" selected />
          <HabitMetricCard title="Heart Rate" value={run.heartRateBpm} unit="bpm" icon="heart" />
          <HabitMetricCard title="Steps" value={run.steps} unit="steps" icon="steps" />
        </div>
      </section>
    </main>
  );
}
