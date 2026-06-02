import { Layout } from "./components/Layout";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { TrustStrip } from "./components/TrustStrip";
import { StatsProvider } from "./context/StatsProvider";

function App() {
  return (
    <StatsProvider>
      <Layout>
        <Hero />
        <TrustStrip />
        <HowItWorks />
      </Layout>
    </StatsProvider>
  );
}

export default App;
