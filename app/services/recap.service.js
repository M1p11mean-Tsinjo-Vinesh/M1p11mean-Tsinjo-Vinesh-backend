export class RecapService {

  /**
   * Gets the progress rate of the employee on the specified date
   * with the total commission he earned
   * @param employeeId
   * @param date
   * @returns {{progress: number, commission: number}}
   */
  async getEmployeeRecap(employeeId, date = new Date()) {
    return {
      progress: 0.25,
      commission: 5000
    }
  }

}