/**
 * @typedef {Object} GunAck
 * @property {string} [err] - Error message if operation failed
 * @property {string} [ok] - Success message
 * @property {number} [wait] - Time to wait before retry
 */

/**
 * @typedef {Object} GunUser
 * @property {string} alias - Username/alias of the user
 * @property {string} pub - Public key
 * @property {string} epub - Encrypted public key
 * @property {Object} [profile] - User profile data
 */

/**
 * @typedef {Object} AuthState
 * @property {GunUser|null} user - Current authenticated user
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {string|null} error - Authentication error if any
 * @property {boolean} loading - Loading state
 */

/**
 * @typedef {Object} GunConfig
 * @property {string[]} peers - Array of peer URLs
 * @property {boolean} [localStorage=true] - Enable/disable localStorage
 * @property {boolean} [radisk=true] - Enable/disable RadiskDB
 */

/**
 * @typedef {Object} UserCredentials
 * @property {string} username - User's username/alias
 * @property {string} password - User's password
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} alias - Username/alias
 * @property {string} [name] - Full name
 * @property {string} [bio] - User biography
 * @property {string} [avatar] - Avatar URL
 * @property {string} createdAt - ISO date string of profile creation
 * @property {string} updatedAt - ISO date string of last update
 */

/**
 * @typedef {'text'|'multiple-choice'|'multiple-select'|'text-area'} QuestionType
 */

/**
 * @typedef {Object} Question
 * @property {string} id - Unique identifier for the question
 * @property {string} text - The question text
 * @property {QuestionType} type - Question type
 * @property {string[]} [options] - Optional array of predefined answers
 * @property {boolean} required - Whether the question requires an answer
 * @property {string} [description] - Optional description or hint
 * @property {number} order - Display order of the question
 * @property {string} createdAt - ISO date string of when the question was created
 */

/**
 * @typedef {Object} Answer
 * @property {string} questionId - ID of the question being answered
 * @property {string} userId - ID of the user answering
 * @property {string} answer - The user's answer
 * @property {string} createdAt - ISO date string of when the answer was created
 */

/**
 * @typedef {Object} UserAnswers
 * @property {string} userId - ID of the user
 * @property {Object.<string, Answer>} answers - Map of questionId to Answer
 * @property {string} updatedAt - ISO date string of last update
 */

/**
 * @callback GunCallback
 * @param {GunAck} ack - Acknowledgment object
 * @returns {void}
 */

/**
 * @callback AuthStateChangeCallback
 * @param {AuthState} state - New authentication state
 * @returns {void}
 */

/**
 * @callback DataChangeCallback
 * @param {any} data - Changed data
 * @param {string} key - Key of changed data
 * @returns {void}
 */

// Export empty object to make this a module
export {};
