import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/common/AppShell";
import { OnboardingStep2Page } from "./pages/OnboardingStep2Page";
import { OnboardingStep3Page } from "./pages/OnboardingStep3Page";
import { OnboardingStep4Page } from "./pages/OnboardingStep4Page";
import { OnboardingStep5Page } from "./pages/OnboardingStep5Page";
import { OnboardingStep6Page } from "./pages/OnboardingStep6Page";
import { OnboardingStep7Page } from "./pages/OnboardingStep7Page";
import { OnboardingStep8Page } from "./pages/OnboardingStep8Page";
import { JourneyPage } from "./pages/JourneyPage";
import { RunningJourneyPage } from "./pages/RunningJourneyPage";
import { RunningActivityPage } from "./pages/RunningActivityPage";
import { RunningRoutePage } from "./pages/RunningRoutePage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/2" replace />} />
        <Route path="/onboarding/2" element={<OnboardingStep2Page />} />
        <Route path="/onboarding/3" element={<OnboardingStep3Page />} />
        <Route path="/onboarding/4" element={<OnboardingStep4Page />} />
        <Route path="/onboarding/5" element={<OnboardingStep5Page />} />
        <Route path="/onboarding/6" element={<OnboardingStep6Page />} />
        <Route path="/onboarding/7" element={<OnboardingStep7Page />} />
        <Route path="/onboarding/8" element={<OnboardingStep8Page />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/journey/running" element={<RunningJourneyPage />} />
        <Route path="/running/activity" element={<RunningActivityPage />} />
        <Route path="/running/route" element={<RunningRoutePage />} />
        <Route path="/running/route/:runId" element={<RunningRoutePage />} />
        <Route path="*" element={<Navigate to="/onboarding/2" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
