import { useContext } from "react";
import { AuthContext } from "./store/auth-context";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PageLayout from "./components/PageLayout/PageLayout";
import HomePage from "./pages/HomePage";
import ClientDetails from "./components/main/clients/ClientDetails";
import Clients from "./components/main/clients/Clients";
import Invoices from "./components/main/invoices/Invoices";
import InvoiceForm from "./components/main/invoices/InvoiceForm";
import InvoiceDetails from "./components/main/invoices/InvoiceDetails";
import AddClient from "./components/main/clients/AddClient";
import AddInvoice from "./components/main/invoices/AddInvoice";

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
            <AddClient />
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
            <AddInvoice />
          </Route>
        )}
        
        {isRegistered && (
          <Route path="/invoices/add/:clientId" exact>
            <AddInvoice />
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
