describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  });

  it('i have some api i want to test that apis this is api http://localhost:4003/api/auth/station/stations    and json datato check api is like {     "code": "NDLS",   "name": "New Delhi",   "city": "Delhi",   "state": "Delhi" } ', function() {
    cy.visit('https://anuragpandey-2441018.postman.co/workspace/irctc-db~e7693040-ca5a-4943-89db-58c1fd20c751/request/create?requestId=25a275cb-8c29-446a-bff0-bba013d50729&sideView=agentMode')
    
  });
})