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
    const [min, max] = PipelineBuilder.getIntervalFrom(year, month);
    this.#pipelines.push({
      $match: {
        [key]: {
          $gte: min,
          $lt: max
        }
      }
    })
    return this;
  }

  get() {
    return this.#pipelines;
  }

  /**
   * generates a list of dates based on the given year and month
   * @param year
   * @param month
   */
  static getListOfDatesFrom(year, month) {
    const [min, max] = PipelineBuilder.getIntervalFrom(year, month);
    return PipelineBuilder.buildDateList(min, max);
  }

  /**
   * generates the list of dates between to given date
   * @param startDate
   * @param endDate
   * @returns {*[]}
   */
  static buildDateList(startDate, endDate) {
    let dateList = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth() + 1
      let day = currentDate.getDate()
      let date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dateList.push(date);
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dateList;
  }

  /**
   * from the input year and month
   * this function returns the min and max date to validate the search by year and month
   * e.g.: year = 2024, month = 2
   * then it returns ["2024-02-01 00:00", "2023-03-01 00:00"]
   * @param year
   * @param month
   * @returns {Date[]}
   */
  static getIntervalFrom(year, month) {
    let currYear = year, nextYear = year;
    let currMonth = parseInt(month ?? "1"), nextMonth = currMonth + 1;
    if(!month || month === 12) {
      nextYear++;
      nextMonth = 1;
    }
    return [
      new Date(`${currYear}-${String(currMonth).padStart(2, '0')}-01T00:00:00+03:00`),
      new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00+03:00`)
    ]
  }

  /**
   * returns the group by day close for a pipeline based on the date-key of the model
   * @param dateKey
   * @returns {{month: {$month: string}, year: {$year: string}, day: {$dayOfMonth: string}}}
   */
  static buildGroupByDayFilter(dateKey) {
    return {
      year: { $year: `$${dateKey}` },
      month: { $month: `$${dateKey}` },
      day: { $dayOfMonth: `$${dateKey}` },
    }
  }

}