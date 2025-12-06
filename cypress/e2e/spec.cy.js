describe('check if the protected route works (my-donations)', () => {
  it('redirects to login if not authenticated', () => {
    cy.visit('donations/my-donations');
    cy.url().should('include', '/login');
    cy.screenshot('protected-route-check-unauthenticated');
  })
});


describe('check if login works', () => {
  it('login the user in', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('amra@gmail.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
    cy.screenshot('login-successful');
  })
})


describe('check if user logout works', () => {
  it('check user logout', function () {
    cy.visit('http://localhost:5000/')
    cy.get('#root a[href="/login"]').click();
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('amra@gmail.com');
    cy.get('#root [name="password"]').type('123');
    cy.get('#root button.ws-auth-btn').click();
    cy.get('#root li:nth-child(5) span').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('name')).to.be.null;
      expect(win.localStorage.getItem('role')).to.be.null;
      cy.screenshot('logout-successful');
    });
  });
});


describe('check if user registration works', () => {
  it('user register check', function () {
    cy.visit('http://localhost:5000/')
    cy.get('#root a[href="/login"]').click();
    cy.get('#root a[href="/signup"]').click();
    cy.get('#root [name="name"]').click();
    cy.get('#root [name="name"]').type('User Test');
    cy.get('#root [name="email"]').type('user@test.com');
    cy.get('#root [name="password"]').type('12345');
    cy.get('#root [name="phone"]').type('1234532344');
    cy.get('#root [name="address"]').click();
    cy.get('#root [name="address"]').type('123 Mint st');
    cy.get('#root [name="city"]').click();
    cy.get('#root [name="city"]').type('Toronto');
    cy.get('#root [name="province"]').select('ON');
    cy.get('#root [name="postal_code"]').click();
    cy.get('#root [name="postal_code"]').type('M2B 3D4');
    cy.get('#root button.ws-auth-btn').click();
    cy.get('#root a[href="/profile"]').click();
    cy.screenshot('registration-successful');
  });
});

describe('check if delete user works', () => {
  it('check delete user', function () {
    cy.visit('http://localhost:5000/')
    cy.get('#root a[href="/login"]').click();
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('user@test.com');
    cy.get('#root [name="password"]').type('12345');
    cy.get('#root button.ws-auth-btn').click();
    cy.get('#root a[href="/profile"]').click();
    cy.get('#root button.ws-delete-btn').click();
    cy.screenshot('delete-user-successful');
  });
});

describe('check if view donation works', () => {
  it('check view donation works', function () {
    cy.visit('http://localhost:5000/')
    cy.get('#root a[href="/donations/browse"][data-discover="true"]').click();
    cy.get('#root article:nth-child(1) button.ws-secondary-btn').click();
    cy.screenshot('view-donation-successful');
  });
});


describe('check if add donation works', () => {
  it('check add donation works', function () {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('role', 'User');
        win.localStorage.setItem('name', 'Amra');
        win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTEyZWVmNzIwYmUyMWM3YTA3MGU4MzUiLCJuYW1lIjoiQW1yYSBTYWVlZCIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzY0OTkyNjExLCJleHAiOjE3NjU1OTc0MTF9.Zc73mlp70GyPXy3hnqvorCAQ5U-k-gu-YPbeDKKuuEw');
      }
    });

    cy.contains('span', 'Donation').parent().trigger('mouseover');
    cy.contains('a', 'Post Donation').click({ force: true });
    cy.get('#root [name="title"]').click();
    cy.get('input[name="title"]').should('be.visible').type('Fall Jacket');
    cy.get('#root [name="category"]').select('women');
    cy.get('#root [name="size"]').click();
    cy.get('#root [name="size"]').type('M');
    cy.get('#root [name="condition"]').select('like-new');
    cy.get('#root [name="description"]').click();
    cy.get('#root [name="description"]').type('new jacket up for donation.');
    cy.get('#root input[accept="image/*"]').click();
    cy.get('#root button.ws-primary-btn').click();
    cy.visit('/donations/my-donations');
    cy.screenshot('add-donation-successful');
  });
});


it('check update donation', function () {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('role', 'User');
      win.localStorage.setItem('name', 'Amra');
      win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTEyZWVmNzIwYmUyMWM3YTA3MGU4MzUiLCJuYW1lIjoiQW1yYSBTYWVlZCIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzY0OTkyNjExLCJleHAiOjE3NjU1OTc0MTF9.Zc73mlp70GyPXy3hnqvorCAQ5U-k-gu-YPbeDKKuuEw');
    }
  });

  cy.contains('span', 'Donation').parent().trigger('mouseover');
  cy.contains('a', 'My Donations').click({ force: true });

  cy.get('#root div:nth-child(1) > div.md-details > div.md-buttons > button.md-btn-edit').click();
  cy.get('#root div.ws-submit-page').click();
  cy.get('#root [name="size"]').clear();
  cy.get('#root [name="size"]').type('L');
  cy.get('#root [name="description"]').click();
  cy.get('#root [name="description"]').type(' new update');
  cy.get('#root button.ws-primary-btn').click();
  cy.visit('/donations/my-donations');
  cy.screenshot('update-donation-successful');
});


describe('check if send request works', () => {
  it('check send request', function () {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('role', 'User');
        win.localStorage.setItem('name', '	Hani User');
        win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTEzNmMzODQwZjZjNzhiZDc4NzAzNjIiLCJuYW1lIjoiSGFuaSBVc2VyIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3NjQ5OTMxNzUsImV4cCI6MTc2NTU5Nzk3NX0.hvrUmFj76MlSbOyblFmFvIU2eRS7f3jnHZn1Bo3XjN4');
      }
    });

    cy.contains('span', 'Donation').parent().trigger('mouseover');
    cy.contains('a', 'Browse Donations').click({ force: true });
    cy.get('#root article:nth-child(2) button.ws-secondary-btn').click();
    cy.get('#root button.ws-primary-btn').click();

    cy.visit('/my-requests');
    cy.wait(300);
    cy.screenshot('send-request-successful');

  });
});

describe('check if withdraw request works', () => {
  it('check withdraw request', function () {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('role', 'User');
        win.localStorage.setItem('name', '	Hani User');
        win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTEzNmMzODQwZjZjNzhiZDc4NzAzNjIiLCJuYW1lIjoiSGFuaSBVc2VyIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3NjQ5OTMxNzUsImV4cCI6MTc2NTU5Nzk3NX0.hvrUmFj76MlSbOyblFmFvIU2eRS7f3jnHZn1Bo3XjN4');
      }
    });

    cy.contains('span', 'My Requests').parent().trigger('mouseover');
    cy.contains('a', 'View My Requests').click({ force: true });
    cy.get('#root div:nth-child(1) > div.ws-request-info > div.ws-request-actions > button.ws-btn-withdraw').click();
    cy.wait(300);
    cy.screenshot('withdraw-request-successful');
  });
});


