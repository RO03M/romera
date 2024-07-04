import { MainPage } from "./pages/main-page";
import { DefaultThemeProvider } from "./core/components/default-theme-provider";
import { NavigationBar } from "./sections/nav/navigation-bar";
import { PresentationPage } from "./sections/presentation/presentation";
import { AboutMe } from "./sections/about-me/about-me";

export function App() {
  return (
    <DefaultThemeProvider>
      <NavigationBar />
      <PresentationPage />
      {/* <AboutMe /> */}
      {/* <MainPage /> */}
    </DefaultThemeProvider>
  );
}
