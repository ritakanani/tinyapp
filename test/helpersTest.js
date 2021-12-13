const { assert } = require('chai');

const { findUserIdByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserIdByEmail("user@example.com", testUsers)
    const expectedUserID = testUsers["userRandomID"];
    assert.strictEqual(user, expectedUserID);
  });
  it('should return undefined for non-existent email', function() {
    const user = findUserIdByEmail("non-existent@example.com", testUsers)
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });
});