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

  const goToClientsTable = () => {
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
    cy.get("[id=ClientsTable]").contains("Show all").click();
  };

  it("Navigate to clients table", () => {
    goToClientsTable();
    cy.url().should("include", "/clients");
  });

  it("Sort by name", () => {
    goToClientsTable();

    var rowGroup = cy
      .get("#ClientsTable")
      .get("[role=rowgroup]", { timeout: 5000 });
    rowGroup.get("[role=row]").contains("newUser@test.com");
    cy.contains("Name").click({ force: true });
    var newRowGroup = cy
      .get("#ClientsTable")
      .get("[role=rowgroup]", { timeout: 5000 });
    newRowGroup.contains("Alice");
  });
});
