import { useContext } from "react";
import { AuthContext } from "./store/auth-context";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PageLayout from "./components/pageLayout/PageLayout";
import HomePage from "./pages/HomePage";
import ClientForm from "./components/main/clients/ClientForm";
import ClientDetails from "./components/main/clients/ClientDetails";
import Clients from "./components/main/clients/Clients";
import Invoices from "./components/main/invoices/Invoices";
import InvoiceForm from "./components/main/invoices/InvoiceForm";
import InvoiceDetails from "./components/main/invoices/InvoiceDetails";

const App = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;
  const { current_user } = authCtx;
  const isRegistered =
    isLoggedIn &&
    current_user !== null &&
    current_user?.companyDetails !== null;

  return (
    <PageLayout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!isLoggedIn && (
          <Route path="/login">
            <AuthPage />
          </Route>
        )}
        {isRegistered && (
          <Route path="/clients/add" exact>
            <ClientForm
              loadAllClients={false}
              isReadOnly={false}
              isEditMode={false}
              showGoBack={true}
            />
          </Route>
        )}
        {isRegistered && (
          <Route path="/clients/:clientId">
            <ClientDetails />
          </Route>
        )}

        {isRegistered && (
          <Route path="/clients/" exact>
            <Clients />
          </Route>
        )}

        {isRegistered && (
          <Route path="/invoices/" exact>
            <Invoices />
          </Route>
        )}

        {isRegistered && (
          <Route path="/invoices/add" exact>
            <InvoiceForm
              loadAllClients={true}
              isEditMode={false}
              openAndPrint={false}
            />
          </Route>
        )}

        {isRegistered && (
          <Route path="/invoices/:invoiceId">
            <InvoiceDetails />
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </PageLayout>
  );
};

export default App;
