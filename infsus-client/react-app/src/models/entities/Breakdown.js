import { BreakdownTypeEnum } from '../enums/BreakdownTypeEnum';
import { BreakdownStatusEnum } from '../enums/BreakdownStatusEnum';
import { User } from './User.js';
import { Task } from './Task.js';

/**
 * Represents a breakdown.
 */
export class Breakdown {
  /**
   * @param {number} id - The breakdown ID.
   * @param {BreakdownType} breakdownType - The type of the breakdown.
   * @param {string} naslov - The title of the breakdown.
   * @param {string} opis - The description of the breakdown.
   * @param {BreakdownStatus} status - The status of the breakdown.
   * @param {number} ordererUserId - The ID of the user who ordered the breakdown.
   * @param {User} ordererUser - The user who ordered the breakdown.
   * @param {Task[]} tasks - The tasks related to the breakdown.
   * @param {string} created - The creation of the breakdown.
   * @param {string} updated - The update of the breakdown.
   */
  constructor(id, breakdownType, naslov, opis, status, ordererUserId, ordererUser, tasks, created, updated) {
    this.id = id;
    this.breakdownType = breakdownType ;
    this.naslov = naslov;
    this.opis = opis;
    this.status = status;
    this.ordererUserId = ordererUserId;
    this.ordererUser = ordererUser ? ordererUser : null;
    this.created = created;
    this.updated = updated;
    this.tasks = tasks ? tasks.map(task => Task.fromJson(task)) : [];
  }

  /**
   * Creates a Breakdown instance from a JSON object.
   * @param {Object} json - The JSON object.
   * @returns {Breakdown} The Breakdown instance.
   */
  static fromJson(json) {
    return new Breakdown(
      json.id,
      json.breakdownType,
      json.naslov,
      json.opis,
      json.status,
      json.ordererUserId,
      json.created,
      this.updated,
      json.ordererUser ? User.fromJson(json.ordererUser) : null,
      json.tasks ? json.tasks.map(task => Task.fromJson(task)) : []
    );
  }
}
