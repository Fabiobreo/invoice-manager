import { mount } from "@cypress/react";
import App from "../../../App";
import AuthContextProvider from "../../../store/auth-context";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

describe("Client form checks", () => {
  const backdropRoot = document.createElement("div");
  backdropRoot.setAttribute("id", "backdrop-root");
  const overlayRoot = document.createElement("div");
  overlayRoot.setAttribute("id", "overlay-root");
  document.body.appendChild(backdropRoot);
  document.body.appendChild(overlayRoot);

  const goToClientForm = () => {
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
    cy.get("[id=ClientsTable]").contains("Add new").click();
  };

  it("Navigate to client form", () => {
    goToClientForm();
    cy.url().should("include", "/clients/add");
  });

  it("Missing name", () => {
    goToClientForm();

    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/clients/add");
  });

  it("Missing email", () => {
    goToClientForm();

    cy.get("[id=name]").type("TestClient").should("have.value", "TestClient");
    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/clients/add");
  });

  it("Missing company name", () => {
    goToClientForm();

    cy.get("[id=name]").type("TestClient").should("have.value", "TestClient");
    cy.get("[id=email]")
      .type("testClient@email.com")
      .should("have.value", "testClient@email.com");
    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/clients/add");
  });

  it("Missing company address", () => {
    goToClientForm();

    cy.get("[id=name]").type("TestClient").should("have.value", "TestClient");
    cy.get("[id=email]")
      .type("testClient@email.com")
      .should("have.value", "testClient@email.com");
    cy.get("[id=companyName]")
      .type("Company Name")
      .should("have.value", "Company Name");
    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/clients/add");
  });

  it("Missing Tax/Vat number", () => {
    goToClientForm();

    cy.get("[id=name]").type("TestClient").should("have.value", "TestClient");
    cy.get("[id=email]")
      .type("testClient@email.com")
      .should("have.value", "testClient@email.com");
    cy.get("[id=companyName]")
      .type("Company Name")
      .should("have.value", "Company Name");
    cy.get("[id=address]")
      .type("1c 213 Derrick Street")
      .should("have.value", "1c 213 Derrick Street");
    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/clients/add");
  });

  it("Missing registration number", () => {
    goToClientForm();

    cy.get("[id=name]").type("TestClient").should("have.value", "TestClient");
    cy.get("[id=email]")
      .type("testClient@email.com")
      .should("have.value", "testClient@email.com");
    cy.get("[id=companyName]")
      .type("Company Name")
      .should("have.value", "Company Name");
    cy.get("[id=address]")
      .type("1c 213 Derrick Street")
      .should("have.value", "1c 213 Derrick Street");
    cy.get("[id=vatNumber]").type("987654").should("have.value", "987654");
    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/clients/add");
  });

  it("Create client", () => {
    goToClientForm();

    cy.get("[id=name]").type("TestClient").should("have.value", "TestClient");
    cy.get("[id=email]")
      .type("testClient@email.com")
      .should("have.value", "testClient@email.com");
    cy.get("[id=companyName]")
      .type("Company Name")
      .should("have.value", "Company Name");
    cy.get("[id=address]")
      .type("1c 213 Derrick Street")
      .should("have.value", "1c 213 Derrick Street");
    cy.get("[id=vatNumber]").type("987654").should("have.value", "987654");
    cy.get("[id=regNumber]").type("987654").should("have.value", "987654");
    cy.get("[id=createClientButton]").click();
    cy.wait(1000);

    cy.url().should("not.include", "/clients/add");
  });
});
