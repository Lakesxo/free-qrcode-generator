import { Layout } from "./components/Layout";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { TrustStrip } from "./components/TrustStrip";

function App() {
  return (
    <Layout>
      <Hero />
      <TrustStrip />
      <HowItWorks />
    </Layout>
  );
}

export default App;
