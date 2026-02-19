import React from "react";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import MVP from "./pages/mvp";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mvp" component={MVP} />
      <Route component={NotFound} />
    </Switch>
  );
}
