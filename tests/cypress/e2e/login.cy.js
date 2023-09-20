const base_url = 'http://localhost:5500/client/';

describe('Login', () => {
    it("Should not login with empty credentials", () => {
        cy.visit(base_url + 'pages/auth/login.html');
        cy.get('button[type="submit"]').click();
        cy.get('.alert').should('be.visible');
    });
    
    it('should not login with wrong credentials', () => {
        cy.visit(base_url + 'pages/auth/login.html');
        cy.get('input[name="email"]').type('admin@gmail.com');
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();
        cy.get('.alert').should('be.visible');
    });

    it('should login with correct credentials', () => {
        cy.visit(base_url + 'pages/auth/login.html');
        cy.get('input[name="email"]').type('itsregalo047@gmail.com');
        cy.get('input[name="password"]').type('Gift4332');
        cy.get('button[type="submit"]').click();
    });
});