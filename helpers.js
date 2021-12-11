

function findUserIdByEmail(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return null;  
}

module.exports = findUserIdByEmail;