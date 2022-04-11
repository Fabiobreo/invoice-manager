import { mount } from "@cypress/react";
import App from "../../../App";
import AuthContextProvider from "../../../store/auth-context";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { wait } from "@testing-library/user-event/dist/utils";

describe("Invoice form checks", () => {
  const backdropRoot = document.createElement("div");
  backdropRoot.setAttribute("id", "backdrop-root");
  const overlayRoot = document.createElement("div");
  overlayRoot.setAttribute("id", "overlay-root");
  document.body.appendChild(backdropRoot);
  document.body.appendChild(overlayRoot);

  const goToInvoiceForm = () => {
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
    cy.get("[id=InvoicesTable]").contains("Add new").click();
  };

  it("Navigate to client form", () => {
    goToInvoiceForm();
    cy.url().should("include", "/invoices/add");
  });

  it("Select a client", () => {
    goToInvoiceForm();
    wait(1000);

    cy.get("[id=selectClient]").type("TestClient | Company Name{enter}");
    cy.get("[id=email]").should("have.value", "testClient@email.com");
  });

  it("Missing invoice number", () => {
    goToInvoiceForm();
    wait(1000);

    cy.get("[id=selectClient]").type("TestClient | Company Name{enter}");
    cy.get("[id=createInvoiceButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/invoices/add");
  });

  it("Missing project identifier", () => {
    goToInvoiceForm();
    wait(1000);

    cy.get("[id=selectClient]").type("TestClient | Company Name{enter}");
    cy.get("[id=invoiceNumber]").type("9999").should("have.value", "9999");
    cy.get("[id=createInvoiceButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/invoices/add");
  });

  it("Missing invoice items", () => {
    goToInvoiceForm();
    wait(1000);

    cy.get("[id=selectClient]").type("TestClient | Company Name{enter}");
    cy.get("[id=invoiceNumber]").type("9999").should("have.value", "9999");
    cy.get("[id=projectIdentifier]").type("9999").should("have.value", "9999");
    cy.get("[id=createInvoiceButton]").click();
    cy.wait(1000);

    cy.url().should("include", "/invoices/add");
  });

  it("Create Invoice", () => {
    goToInvoiceForm();
    wait(1000);

    cy.get("[id=selectClient]").type("TestClient | Company Name{enter}");
    cy.get("[id=invoiceNumber]").type("9999").should("have.value", "9999");
    cy.get("[id=projectIdentifier]").type("9999").should("have.value", "9999");
    cy.get("[id=item0]").type("Test item").should("have.value", "Test item");
    cy.get("[id=price0]").clear().type("9999").should("have.value", "9999");
    cy.get("[id=createInvoiceButton]").click();
    cy.wait(1000);

    cy.url().should("not.include", "/invoices/add");
  });
});
