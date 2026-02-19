/* 
 * Design Philosophy: Neo-Brutalism Digital Street Culture
 * Dark mode with electric cyan (#00F0FF) and hot magenta (#FF006E) accents
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MvpMap from "./pages/MvpMap";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/mvp" component={MvpMap} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
