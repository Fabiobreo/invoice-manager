import { useContext } from "react";
import { AuthContext } from "./store/auth-context";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PageLayout from "./components/PageLayout/PageLayout";
import LoadingSpinner from "./components/UI/LoadingSpinner";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <PageLayout>
      <Switch>
        <Route path="/" exact></Route>
        {!authCtx.isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        <Route path="/profile">
          {!authCtx.isLoggedIn && <Redirect to="/auth" />}
          {authCtx.isLoggedIn && <div className='centered'><LoadingSpinner/></div>}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </PageLayout>
  );
}

export default App;
