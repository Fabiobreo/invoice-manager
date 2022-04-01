import { mount } from "@cypress/react";
import App from "../../App";
import AuthContextProvider from "../../store/auth-context";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

describe("Login checks", () => {
  const backdropRoot = document.createElement("div");
  backdropRoot.setAttribute("id", "backdrop-root");
  const overlayRoot = document.createElement("div");
  overlayRoot.setAttribute("id", "overlay-root");
  document.body.appendChild(backdropRoot);
  document.body.appendChild(overlayRoot);

  it("Navigate to login", () => {
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
    cy.get("[id=loginButton]").should("be.visible");
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
    cy.get("[id=loginButton]").click();
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
    cy.get("[id=email]")
      .type("fake_user1@officehourtesting.com")
      .should("have.value", "fake_user1@officehourtesting.com");
    cy.get("[id=loginButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
  });

  it("Authentication failed", () => {
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
    cy.get("[id=password]").type("12345").should("have.value", "12345");
    cy.get("[id=loginButton]").click();
    cy.wait(1000);

    cy.get("[id=headerLogout]").should("not.exist");
    cy.get("[id=modalErrorTitle]").contains("Authentication failed");
  });

  it("Login", () => {
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
  });
});
