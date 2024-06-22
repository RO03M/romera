import { ThemeProvider } from "@mui/joy";
import { NavigationBar } from './sections/nav/navigation-bar';
import { PresentationPage } from './sections/presentation/presentation';
import { AboutMe } from "./sections/about-me/about-me";

export function App() {
  return (
    <ThemeProvider>
      <NavigationBar />
      <PresentationPage />
      <AboutMe />
    </ThemeProvider>
  );
}
