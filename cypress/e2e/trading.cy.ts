import { LoginCommand } from '../support/commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login: LoginCommand;
    }
  }
}

describe('Trading Platform E2E Tests', () => {
  beforeEach(() => {
    // Custom command defined in commands.ts
    cy.login('testuser', 'testpassword');
  });

  describe('Market Data', () => {
    it('should display live market data', () => {
      cy.visit('/trade');
      cy.get('[data-testid="trading-chart"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="current-price"]').should('not.be.empty');
      cy.get('[data-testid="price-change"]').should('be.visible');
    });

    it('should update chart timeframe', () => {
      cy.visit('/trade');
      cy.get('[data-testid="timeframe-selector"]').select('1H');
      cy.get('[data-testid="trading-chart"]').should('be.visible');
      cy.get('[data-testid="loading-indicator"]').should('not.exist');
    });
  });

  describe('Order Management', () => {
    it('should place and verify market order', () => {
      cy.visit('/trade');
      cy.get('[data-testid="order-type-selector"]').select('market');
      cy.get('[data-testid="order-side-buy"]').click();
      cy.get('[data-testid="order-quantity"]').clear().type('1');
      cy.get('[data-testid="place-order-button"]').click();
      cy.get('[data-testid="order-confirmation"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="order-status"]').should('contain', 'filled');
    });

    it('should place and cancel limit order', () => {
      cy.visit('/trade');
      cy.get('[data-testid="order-type-selector"]').select('limit');
      cy.get('[data-testid="order-side-buy"]').click();
      cy.get('[data-testid="order-quantity"]').clear().type('1');
      cy.get('[data-testid="limit-price"]').clear().type('150.00');
      cy.get('[data-testid="place-order-button"]').click();
      cy.get('[data-testid="active-orders"]').should('contain', 'AAPL');
      cy.get('[data-testid="cancel-order-button"]').first().click();
      cy.get('[data-testid="order-cancelled"]').should('be.visible');
    });
  });

  describe('Portfolio Management', () => {
    it('should display portfolio summary', () => {
      cy.visit('/portfolio');
      cy.get('[data-testid="portfolio-summary"]').should('be.visible');
      cy.get('[data-testid="total-value"]').should('not.be.empty');
      cy.get('[data-testid="available-cash"]').should('not.be.empty');
      cy.get('[data-testid="positions-table"]').should('be.visible');
    });

    it('should show position details', () => {
      cy.visit('/portfolio');
      cy.get('[data-testid="positions-table"]').should('be.visible');
      cy.get('[data-testid="position-row"]').first().click();
      cy.get('[data-testid="position-details"]').should('be.visible');
      cy.get('[data-testid="position-pl"]').should('exist');
      cy.get('[data-testid="position-value"]').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid order inputs', () => {
      cy.visit('/trade');
      cy.get('[data-testid="order-type-selector"]').select('market');
      cy.get('[data-testid="order-side-buy"]').click();
      cy.get('[data-testid="order-quantity"]').clear().type('-1');
      cy.get('[data-testid="place-order-button"]').click();
      cy.get('[data-testid="error-message"]').should('be.visible')
        .and('contain', 'Invalid quantity');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '/api/market/*/price', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getPriceError');

      cy.visit('/trade');
      cy.wait('@getPriceError');
      cy.get('[data-testid="error-notification"]').should('be.visible')
        .and('contain', 'Unable to fetch market data');
    });
  });

  describe('Real-time Updates', () => {
    it('should handle WebSocket reconnection', () => {
      cy.visit('/trade');
      cy.window().then((win) => {
        win.postMessage({ type: 'WS_DISCONNECT_TEST' }, '*');
      });
      cy.get('[data-testid="connection-status"]').should('contain', 'Reconnecting');
      cy.get('[data-testid="connection-status"]', { timeout: 10000 })
        .should('contain', 'Connected');
    });

    it('should update prices in real-time', () => {
      cy.visit('/trade');
      cy.get('[data-testid="current-price"]').invoke('text').then((initialPrice) => {
        cy.get('[data-testid="current-price"]', { timeout: 10000 })
          .should('not.have.text', initialPrice);
      });
    });
  });
});
