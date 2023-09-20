const base_url = 'http://localhost:5500/client/';

describe('Register', () => {
    it('Should not register with empty credentials', () => {
        cy.visit(base_url + 'pages/auth/register.html');
        cy.get('button[type="submit"]').click();
        cy.get('.alert').should('be.visible');
    });

    it('Should not register with invalid email', () => {
        cy.visit(base_url + 'pages/auth/register.html');
        cy.get('input[name="email"]').type('admin');
        cy.get('input[name="password"]').type('123456');
        cy.get('input[name="repeat_password"]').type('123456');
        cy.get('button[type="submit"]').click();
    });

    it('Should not register with invalid password', () => {
        cy.visit(base_url + 'pages/auth/register.html');
        cy.get('input[name="email"]').type('admin@gmail.com');
        cy.get('input[name="password"]').type('123');
        cy.get('input[name="repeat_password"]').type('123');
        cy.get('button[type="submit"]').click();
    });

    it('Should not register with mismatched passwords', () => {
        cy.visit(base_url + 'pages/auth/register.html');
        cy.get('input[name="email"]').type('itsregalo047@gmail.com');
        cy.get('input[name="username"]').type('regalo');
        cy.get('input[name="full_name"]').type('Regalo');
        cy.get('input[name="password"]').type('123456');
        cy.get('input[name="repeat_password"]').type('1234567');
        cy.get('button[type="submit"]').click();
    });

    it('Should register with correct credentials', () => {
        cy.visit(base_url + 'pages/auth/register.html');
        cy.get('input[name="email"]').type('sopapiw264@apxby.com');
        cy.get('input[name="username"]').type('sopapiw264');
        cy.get('input[name="full_name"]').type('sopapiw264');
        cy.get('input[name="password"]').type('Gift4332');
        cy.get('input[name="repeat_password"]').type('Gift4332');
        cy.get('button[type="submit"]').click();
    });
})