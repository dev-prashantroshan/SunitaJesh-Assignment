import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  Footprints,
  HeartPulse,
  Pause,
  Play,
  Timer,
  TrendingUp,
} from "lucide-react";
import styles from "./RunningRoutePage.module.css";
import { apiUrl } from "../utils/api";

interface CurrentRun {
  id: string;
  distanceKm: number;
  durationFormatted: string;
  calories: number;
  heartRateBpm: number;
  steps: number;
}

interface RoutePoint {
  latitude: number;
  longitude: number;
  order: number;
}

interface OverlayPoint {
  x: number;
  y: number;
}

const DEVICE_ID = "device-thomas-001";

function formatCompactSteps(steps: number) {
  if (steps < 1000) {
    return steps.toString();
  }

  return `${(steps / 1000).toFixed(3)}`;
}

function getOverlayPoints(route: RoutePoint[]): OverlayPoint[] {
  if (route.length === 0) {
    return [];
  }

  const sorted = [...route].sort((a, b) => a.order - b.order);
  const minLat = Math.min(...sorted.map((point) => point.latitude));
  const maxLat = Math.max(...sorted.map((point) => point.latitude));
  const minLon = Math.min(...sorted.map((point) => point.longitude));
  const maxLon = Math.max(...sorted.map((point) => point.longitude));
  const latRange = maxLat - minLat || 1;
  const lonRange = maxLon - minLon || 1;

  return sorted.map((point) => ({
    x: 25 + ((point.longitude - minLon) / lonRange) * 50,
    y: 25 + ((maxLat - point.latitude) / latRange) * 47,
  }));
}

export function RunningRoutePage() {
  const navigate = useNavigate();
  const { runId } = useParams();
  const [run, setRun] = useState<CurrentRun | null>(null);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRouteData = async () => {
    setLoading(true);
    setError("");

    try {
      const runResponse = await fetch(apiUrl("/api/runs/current"), {
        headers: {
          "x-device-id": DEVICE_ID,
        },
      });
      const runResult = await runResponse.json();

      if (!runResponse.ok || !runResult.success) {
        throw new Error("Unable to load current run");
      }

      const currentRun = runResult.data.run as CurrentRun;
      const routeId = runId ?? currentRun.id;
      const routeResponse = await fetch(apiUrl(`/api/runs/${routeId}/route`), {
        headers: {
          "x-device-id": DEVICE_ID,
        },
      });
      const routeResult = await routeResponse.json();

      if (!routeResponse.ok || !routeResult.success) {
        throw new Error("Unable to load route");
      }

      setRun(currentRun);
      setRoute(routeResult.data.route);
    } catch {
      setError("We couldn't load your running route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteData();
  }, [runId]);

  const overlayPoints = useMemo(() => getOverlayPoints(route), [route]);
  const polylinePoints = overlayPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const startPoint = overlayPoints[0];
  const endPoint = overlayPoints[overlayPoints.length - 1];

  if (loading) {
    return <p className={styles.message}>Loading route...</p>;
  }

  if (error || !run) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error || "Route not found."}</p>
          <button type="button" onClick={fetchRouteData}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <img className={styles.map} src="/assets/maps/map.png" alt="Running route map" />
      <div className={styles.mapShade} />

      <header className={styles.header}>
        <button
          className={styles.backButton}
          type="button"
          aria-label="Back"
          onClick={() => navigate("/running/activity")}
        >
          <ArrowLeft size={24} strokeWidth={2.1} />
        </button>
        <span className={styles.headerRouteLine} />
        <div>
          <p>My Route</p>
          <h1>Running to Hyde Park</h1>
          <span>
            <Timer size={16} strokeWidth={2.2} /> Mon 5 <i /> 11:00 AM
          </span>
        </div>
      </header>

      <section className={styles.routeLayer} aria-label="Route map overlay">
        <svg className={styles.routeSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          {polylinePoints ? <polyline points={polylinePoints} /> : null}
        </svg>
        {startPoint ? (
          <img
            className={styles.mapPin}
            src="/assets/maps/map-pin.png"
            alt=""
          />
        ) : null}
        {endPoint ? (
          <span
            className={styles.destinationMarker}
            style={{ left: `${endPoint.x}%`, top: `${endPoint.y}%` }}
          />
        ) : null}
        {overlayPoints[1] ? (
          <span
            className={styles.midMarker}
            style={{ left: `${overlayPoints[1].x}%`, top: `${overlayPoints[1].y}%` }}
          />
        ) : null}
      </section>

      <section className={styles.bottomPanel}>
        <div className={styles.metrics}>
          <article className={`${styles.metricCard} ${styles.selectedMetric}`}>
            <Flame size={24} strokeWidth={2.2} />
            <strong>{run.calories}</strong>
            <span>Calories</span>
          </article>
          <article className={styles.metricCard}>
            <HeartPulse size={25} strokeWidth={2.15} />
            <strong>{run.heartRateBpm}</strong>
            <span>Heart Rate</span>
          </article>
          <article className={styles.metricCard}>
            <Footprints size={26} strokeWidth={2.15} />
            <strong>{formatCompactSteps(run.steps)}</strong>
            <span>Steps</span>
          </article>
        </div>

        <div className={styles.timerRow}>
          <div>
            <p>
              <Timer size={17} strokeWidth={2.3} />
              Timer
              {paused ? <span className={styles.pausedText}>Paused</span> : null}
            </p>
            <strong>
              {run.durationFormatted} <i /> {run.distanceKm} km <TrendingUp size={17} strokeWidth={2.2} />
            </strong>
          </div>
          <button
            className={`${styles.pauseButton} ${paused ? styles.paused : ""}`}
            type="button"
            aria-label={paused ? "Resume run" : "Pause run"}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? <Play size={25} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
          </button>
        </div>
      </section>
    </main>
  );
}
