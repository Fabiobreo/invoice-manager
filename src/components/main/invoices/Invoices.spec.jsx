import { mount } from "@cypress/react";
import App from "../../../App";
import AuthContextProvider from "../../../store/auth-context";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

describe("Clients table checks", () => {
  const backdropRoot = document.createElement("div");
  backdropRoot.setAttribute("id", "backdrop-root");
  const overlayRoot = document.createElement("div");
  overlayRoot.setAttribute("id", "overlay-root");
  document.body.appendChild(backdropRoot);
  document.body.appendChild(overlayRoot);

  const goToInvoicesTable = () => {
    mount(
      <AuthContextProvider>
        <BrowserRouter>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </AuthContextProvider>
    );
    cy.get("[id=headerLogin]").click();
    cy.get("[id=email]")
      .type("fake_user1@officehourtesting.com")
      .should("have.value", "fake_user1@officehourtesting.com");
    cy.get("[id=password]").type("123456").should("have.value", "123456");
    cy.get("[id=loginButton]").click({ force: true });
    cy.get("[id=headerLogout]").should("be.visible");
    cy.get("[id=InvoicesTable]").contains("Show all").click();
  };

  it("Navigate to invoices table", () => {
    goToInvoicesTable();
    cy.url().should("include", "/invoices");
  });

  it("Sort by date", () => {
    goToInvoicesTable();

    var rowGroup = cy
      .get("#InvoicesTable")
      .get("[role=rowgroup]", { timeout: 5000 });
    rowGroup.get("[role=row]").contains("Company");
    cy.contains("Date (MM-dd-yyyy)").click({ force: true });
    var newRowGroup = cy
      .get("#InvoicesTable")
      .get("[role=rowgroup]", { timeout: 5000 });
    newRowGroup.contains("Sky");
  });

  it("Filter by client", () => {
    goToInvoicesTable();

    var rowGroup = cy
      .get("#InvoicesTable")
      .get("[role=rowgroup]", { timeout: 5000 });
    rowGroup.get("[role=row]").contains("Company");

    cy.get("[id=selectClient]").type("TestClient | Company Name{enter}");
    var newRowGroup = cy
      .get("#InvoicesTable")
      .get("[role=rowgroup]", { timeout: 5000 });
    newRowGroup.contains("TestClient");
  });
});
