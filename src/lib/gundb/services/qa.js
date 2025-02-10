import gun from '../core/gunInstance';
import { get } from 'svelte/store';
import { authStore } from '../stores/auth';
import questions from '../data/profile-questions.json';

/**
 * Service for handling Q&A operations
 */
class QAService {
  constructor() {
    /** @type {import('gun').IGunInstance} */
    this.gun = gun;
  }

  /**
   * Get all questions
   * @returns {Promise<import('../core/types').Question[]>}
   */
  async getQuestions() {
    return questions.questions;
  }

  /**
   * Get the next unanswered required question
   * @returns {Promise<import('../core/types').Question|null>}
   */
  async getNextQuestion() {
    const answers = await this.getUserAnswers();
    const question = questions.questions.find(q => 
      q.required && !answers[q.id]
    );
    return question || null;
  }

  /**
   * Save an answer for a question
   * @param {string} questionId - ID of the question
   * @param {string|string[]} answer - Answer to save
   * @returns {Promise<void>}
   */
  async saveAnswer(questionId, answer) {
    const authState = get(authStore);
    if (!authState.user) {
      throw new Error('User not authenticated');
    }

    // Find the question to get its type
    const question = questions.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Convert array answers to string for storage
    const processedAnswer = Array.isArray(answer) ? answer.join('|||') : answer;

    return new Promise((resolve, reject) => {
      this.gun
        .user()
        .get('answers')
        .get(questionId)
        .put({ answer: processedAnswer }, (ack) => {
          if (ack.err) {
            reject(new Error(ack.err));
          } else {
            console.log(ack);
            console.log('answer saved: ', questionId);
            resolve();
          }
        });
    });
  }

  /**
   * Get all answers for the current user
   * @returns {Promise<Object.<string, import('../core/types').Answer>>}
   */
  async getUserAnswers() {
    const authState = get(authStore);
    if (!authState.user) {
      throw new Error('User not authenticated');
    }

    return new Promise((resolve) => {
      this.gun
        .user()
        .get('answers')
        .once((data) => {
          if (!data) {
            resolve({});
            return;
          }

          // Process the answers and convert string back to array where needed
          const processedAnswers = {};
          Object.keys(data).forEach(questionId => {
            if (data[questionId] && data[questionId].answer) {
              const question = questions.questions.find(q => q.id === questionId);
              const rawAnswer = data[questionId].answer;
              
              // Convert string back to array for multiple-select questions
              const processedAnswer = question?.type === 'multiple-select' && rawAnswer 
                ? rawAnswer.split('|||')
                : rawAnswer;

              processedAnswers[questionId] = {
                answer: processedAnswer,
                timestamp: data[questionId].timestamp
              };
            }
          });

          resolve(processedAnswers);
        });
    });
  }

  /**
   * Subscribe to changes in user's answers
   * @param {(answers: Object.<string, import('../core/types').Answer>) => void} callback 
   * @returns {() => void} Unsubscribe function
   */
  subscribeToAnswers(callback) {
    const authState = get(authStore);
    if (!authState.user) {
      throw new Error('User not authenticated');
    }

    const subscription = this.gun
      .user()
      .get('answers')
      .on((data) => {
        if (!data) {
          callback({});
          return;
        }

        // Process the answers and convert string back to array where needed
        const processedAnswers = {};
        Object.keys(data).forEach(questionId => {
          if (data[questionId] && data[questionId].answer) {
            const question = questions.questions.find(q => q.id === questionId);
            const rawAnswer = data[questionId].answer;
            
            // Convert string back to array for multiple-select questions
            const processedAnswer = question?.type === 'multiple-select' && rawAnswer
              ? rawAnswer.split('|||')
              : rawAnswer;

            processedAnswers[questionId] = {
              answer: processedAnswer,
              timestamp: data[questionId].timestamp
            };
          }
        });

        callback(processedAnswers);
      });

    // Return unsubscribe function
    return () => subscription.off();
  }
}

// Export a singleton instance
export const qaService = new QAService();
