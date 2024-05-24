import { TaskStatusEnum } from '../enums/TaskStatusEnum';
import { Breakdown } from './Breakdown.js';

/**
 * Represents a task.
 */
export class Task {
  /**
   * @param {number} id - The task ID.
   * @param {number} breakdownId - The ID of the related breakdown.
   * @param {number} majstorId - The ID of the assigned worker.
   * @param {number} adminId - The ID of the admin.
   * @param {string} opis - The description of the task.
   * @param {Date} rok - The deadline of the task.
   * @param {TaskStatusEnum} status - The status of the task.
   * @param {Breakdown} breakdown - The related breakdown.
   * @param {String} created - The created of the task.
   * @param {String} updated - The updated of the task.
   */
  constructor(id, breakdownId, majstorId, adminId, opis, rok, status, breakdown, created, updated) {
    this.id = id;
    this.breakdownId = breakdownId;
    this.majstorId = majstorId;
    this.adminId = adminId;
    this.opis = opis;
    this.rok = new Date(rok);
    this.status = status;
    this.breakdown = breakdown ? Breakdown.fromJson(breakdown) : null;
    this.created =  created;
    this.updated =  updated;
  }

  /**
   * Creates a Task instance from a JSON object.
   * @param {Object} json - The JSON object.
   * @returns {Task} The Task instance.
   */
  static fromJson(json) {
    return new Task(
      json.id,
      json.breakdownId,
      json.majstorId,
      json.adminId,
      json.opis,
      json.rok,
      json.status,
      json.breakdown,
      json.created,
      json.updated
    );
  }
}
