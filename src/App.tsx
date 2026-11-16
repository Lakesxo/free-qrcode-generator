import { Layout } from "./components/Layout";
import { Hero } from "./components/Hero";
import { Faq } from "./components/Faq";
import { StatsProvider } from "./context/StatsProvider";

function App() {
  return (
    <StatsProvider>
      <Layout>
        <Hero />
        <Faq />
      </Layout>
    </StatsProvider>
  );
}

export default App;
