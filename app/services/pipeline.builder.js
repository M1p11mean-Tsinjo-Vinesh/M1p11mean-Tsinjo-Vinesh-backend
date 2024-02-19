import mongoose from "mongoose";

export class PipelineBuilder {

  #pipelines = [];

  constructor(pipelines = []) {
    this.#pipelines = pipelines;
  }

  /**
   * if an attribute of model is an ObjectId, then you should use this function to filter
   * @param idValue
   * @param idKey
   * @returns {PipelineBuilder}
   */
  filterByKeyId(idValue, idKey = "_id") {
    if(idValue) {
      this.#pipelines.push({
        $match: {
          [idKey]: new mongoose.Types.ObjectId(idValue)
        }
      })
    }
    return this;
  }

  /**
   * Do group by
   * @param args
   * @returns {PipelineBuilder}
   */
  group(args) {
    this.#pipelines.push({
      $group: {
        ...args
      }
    })
    return this;
  }

  /**
   * do projection
   * @param columns
   */
  project(columns) {
    this.#pipelines.push({
      $project: {
        ...columns
      }
    })
    return this;
  }

  /**
   * filter by month and year based on a date-key
   * if month is not defined then the whole year will show
   * @param key ~ the schema key
   * @param year by default it's currentYear
   * @param month
   */
  filterByPeriod(key, year = new Date().getFullYear(), month = undefined) {
    let currYear = year, nextYear = year;
    let currMonth = parseInt(month ?? "1"), nextMonth = currMonth + 1;
    if(!month || month === 12) {
      nextYear++;
      nextMonth = 1;
    }
    this.#pipelines.push({
      $match: {
        [key]: {
          $gte: new Date(`${currYear}-${String(currMonth).padStart(2, '0')}-01T00:00:00+03:00`),
          $lt: new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00+03:00`)
        }
      }
    })
    return this;
  }

  get() {
    return this.#pipelines;
  }

   static buildGroupByDayFilter(dateKey) {
    return {
      year: { $year: `$${dateKey}` },
      month: { $month: `$${dateKey}` },
      day: { $dayOfMonth: `$${dateKey}` },
    }
  }

}