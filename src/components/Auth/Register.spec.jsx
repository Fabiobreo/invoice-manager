import { mount } from "@cypress/react";
import App from "../../App";
import AuthContextProvider from "../../store/auth-context";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

describe("Register checks", () => {
  const backdropRoot = document.createElement("div");
  backdropRoot.setAttribute("id", "backdrop-root");
  const overlayRoot = document.createElement("div");
  overlayRoot.setAttribute("id", "overlay-root");
  document.body.appendChild(backdropRoot);
  document.body.appendChild(overlayRoot);

  it("Navigate to register", () => {
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
    cy.get("[id=switchButton]").click();
    cy.contains("Sign Up");
  });

  it("Missing name", () => {
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
    cy.get("[id=switchButton]").click();
    cy.get("[id=registerButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
  });

  it("Missing email", () => {
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
    cy.get("[id=switchButton]").click();
    cy.get("[id=name]")
      .type("Cypress name")
      .should("have.value", "Cypress name");
    cy.get("[id=registerButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
  });

  it("Missing password", () => {
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
    cy.get("[id=switchButton]").click();
    cy.get("[id=name]")
      .type("Cypress name")
      .should("have.value", "Cypress name");
    cy.get("[id=email]")
      .type("cypresstest@email.com")
      .should("have.value", "cypresstest@email.com");
    cy.get("[id=registerButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
  });

  it("Missing confirm password", () => {
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
    cy.get("[id=switchButton]").click();
    cy.get("[id=name]")
      .type("Cypress name")
      .should("have.value", "Cypress name");
    cy.get("[id=email]")
      .type("cypresstest@email.com")
      .should("have.value", "cypresstest@email.com");
    cy.get("[id=password]").type("123456").should("have.value", "123456");
    cy.get("[id=registerButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
  });

  it("Missing password mismatch", () => {
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
    cy.get("[id=switchButton]").click();
    cy.get("[id=name]")
      .type("Cypress name")
      .should("have.value", "Cypress name");
    cy.get("[id=email]")
      .type("cypresstest@email.com")
      .should("have.value", "cypresstest@email.com");
    cy.get("[id=password]").type("123456").should("have.value", "123456");
    cy.get("[id=confirmPassword]").type("12345").should("have.value", "12345");
    cy.get("[id=registerButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
    cy.get("[id=confirmPasswordMismatch]").should("exist");
  });

  it("Register", () => {
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
    cy.get("[id=switchButton]").click();
    cy.get("[id=name]")
      .type("Cypress name")
      .should("have.value", "Cypress name");
    cy.get("[id=email]")
      .type("cypresstest@email.com")
      .should("have.value", "cypresstest@email.com");
    cy.get("[id=password]").type("123456").should("have.value", "123456");
    cy.get("[id=confirmPassword]")
      .type("123456")
      .should("have.value", "123456");
    cy.get("[id=registerButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("be.visible");
  });
});
