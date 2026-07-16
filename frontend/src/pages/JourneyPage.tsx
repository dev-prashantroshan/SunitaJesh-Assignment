import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Apple,
  ArrowRight,
  Bike,
  Footprints,
  Menu,
  Search,
  Sprout,
  Target,
} from "lucide-react";
import styles from "./JourneyPage.module.css";

interface Journey {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  durationWeeks: number;
  difficulty: string;
  featured: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEVICE_ID = "device-thomas-001";
const fallbackReport = "All your details in a single place";

function GreetingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.avatar} aria-hidden="true">
        T
      </div>
      <div className={styles.greetingText}>
        <span>Hello,</span>
        <strong>Thomas</strong>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.iconButton} type="button" aria-label="Search">
          <Search size={24} strokeWidth={2.2} />
        </button>
        <span className={styles.headerDivider} />
        <button className={styles.iconButton} type="button" aria-label="Menu">
          <Menu size={26} strokeWidth={2.1} />
        </button>
      </div>
    </header>
  );
}

function PromoBanner({ journey }: { journey: Journey }) {
  return (
    <section className={styles.bannerWrap}>
      <div className={styles.bannerShadowOne} />
      <div className={styles.bannerShadowTwo} />
      <div className={styles.banner}>
        <div className={styles.bannerCopy}>
          <h1>Create your Custom Workout Plan</h1>
          <p>Training&amp;Nutrition</p>
          <span>
            {journey.category} • {journey.durationWeeks} weeks • {journey.difficulty}
          </span>
        </div>
        <div className={styles.bannerArt} aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={styles.ringInner} />
          <img src={journey.imageUrl} alt="" />
        </div>
      </div>
    </section>
  );
}

function ActivityCarousel() {
  const navigate = useNavigate();
  const activities = [
    { label: "Running", icon: Footprints, onClick: () => navigate("/journey/running") },
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
              className={styles.activityCard}
              type="button"
              onClick={activity.onClick}
            >
              <Icon size={28} strokeWidth={2.1} />
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
  type: "goals" | "nutrition";
}) {
  const Icon = type === "goals" ? Target : Apple;

  return (
    <article className={styles.habitCard}>
      <div className={`${styles.habitIllustration} ${styles[type]}`}>
        <span className={styles.habitRing} />
        <span className={styles.habitCircle}>
          <Icon size={38} strokeWidth={2.2} />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}

function DailyReportCard({ description, loading }: { description: string; loading: boolean }) {
  return (
    <article className={styles.reportCard}>
      <div>
        <h3>Daily Reports</h3>
        <p className={styles.reportDescription}>
          {loading ? "Loading daily insight..." : description}
        </p>
      </div>
      <button className={styles.reportButton} type="button" aria-label="Open daily reports">
        <ArrowRight size={24} strokeWidth={2.4} />
      </button>
    </article>
  );
}

export function JourneyPage() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [reportDescription, setReportDescription] = useState(fallbackReport);
  const [reportLoading, setReportLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJourneys = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/journeys`, {
        headers: {
          "x-device-id": DEVICE_ID,
        },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load journeys");
      }

      const journeys = result.data.journeys as Journey[];
      setJourney(journeys.find((item) => item.featured) ?? journeys[0] ?? null);
    } catch {
      setError("We couldn't load your journey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceholderContent = async () => {
    setReportLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/content/placeholder`);
      const result = await response.json();

      if (!response.ok || !result.success || typeof result.data?.description !== "string") {
        throw new Error("Unable to load placeholder content");
      }

      setReportDescription(result.data.description);
    } catch {
      setReportDescription(fallbackReport);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
    fetchPlaceholderContent();
  }, []);

  return (
    <main className={styles.page}>
      <GreetingHeader />

      {loading ? <p className={styles.message}>Loading journey...</p> : null}

      {!loading && error ? (
        <div className={styles.errorBox}>
          <p>{error}</p>
          <button type="button" onClick={fetchJourneys}>
            Retry
          </button>
        </div>
      ) : null}

      {!loading && journey ? (
        <>
          <PromoBanner journey={journey} />
          <ActivityCarousel />

          <section className={styles.section}>
            <h2>Your habits</h2>
            <div className={styles.habitsGrid}>
              <HabitCard title="Goals" value="73% achived" type="goals" />
              <HabitCard title="Nutrition" value="3 hours of fasting" type="nutrition" />
            </div>
          </section>

          <DailyReportCard description={reportDescription} loading={reportLoading} />
        </>
      ) : null}
    </main>
  );
}
