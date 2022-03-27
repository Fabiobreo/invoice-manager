import { useContext } from "react";
import { AuthContext } from "./store/auth-context";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PageLayout from "./components/pageLayout/PageLayout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import HomePage from "./pages/HomePage";
import ClientForm from "./components/main/clients/ClientForm";
import ClientDetails from "./components/main/clients/ClientDetails";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <PageLayout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path="/login">
            <AuthPage />
          </Route>
        )}
        <Route path="/profile">
          {!authCtx.isLoggedIn && <Redirect to="/login" />}
          {authCtx.isLoggedIn && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
        </Route>
        <Route path="/clients/" exact>
          <div className="centered">Clients</div>
        </Route>
        <Route path="/clients/add" exact>
          <ClientForm />
        </Route>
        <Route path="/clients/:clientId">
          <ClientDetails />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </PageLayout>
  );
}

export default App;
