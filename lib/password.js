import bcrypt from 'bcrypt'

module.exports = {
  // hash {{{
  /**
   * Hash a password using bcrypt
   *
   * @param {String} password - The password to hash
   * @returns {Promise} Promise containing the hashed password
   */
  hash: (password) => {
    /**
     * Generate a salt
     *
     * @param {Type} argName - Arg long description
     * @returns {Promise} Salt returned as a Promise
     */
    async function generateSalt () {
      let rounds = 10

      return bcrypt.genSalt(rounds)
    }

    /**
     * Hash the password
     *
     * @returns {Promise} Password hashed with bcrypt
     */
    async function hash (password) {
      let salt = await generateSalt()

      return bcrypt.hash(password, salt)
    }

    /** Return a Promise */
    return hash(password)
  },
  // }}}
  // compare {{{
  /**
   * Compare a hashed password to a given one by the user
   *
   * @param {String} hashed - Password coming from the database
   * @param {String} input - Password given by the user
   * @returns {Promise} Comparison result
   */
  compare: (input, hashed) => {
    return bcrypt.compare(input, hashed)
  }
  // }}}
}
