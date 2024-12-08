describe('LoginForm', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/') // Assuming your component is rendered on the homepage
    })

    it('displays the login form correctly', () => {
        cy.get('h1').should('contain', 'Login to Dog Breeds Catalog')
        cy.get('form').should('exist')
        cy.get('input[name="email"]').should('exist')
        cy.get('input[name="password"]').should('exist')
        cy.get('button[type="submit"]').should('exist').and('contain', 'Log In')
    })

    it('allows users to input email and password', () => {
        const email = 'test@example.com'
        const password = 'password123'

        cy.get('input[name="email"]').type(email).should('have.value', email)
        cy.get('input[name="password"]').type(password).should('have.value', password)
    })

    it('submits the form with valid credentials and redirects to homescreen', () => {
        // Stub the API request to return a successful response
        cy.intercept('POST', '/auth/authenticate', {
            statusCode: 200,
            body: { accessToken: 'mockAccessToken' }
        }).as('loginRequest')

        // Fill out the form with valid credentials
        cy.get('input[name="email"]').type('valid@example.com')
        cy.get('input[name="password"]').type('validpassword')

        // Submit the form
        cy.get('button[type="submit"]').click()

        // Ensure the request was made
        cy.wait('@loginRequest').then(() => {
            // Ensure redirection to homescreen
            cy.url().should('include', '/homescreen')
        })
    })
})
