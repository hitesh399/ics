var format = require("date-fns/format");

class BulkQueryBuilder {
  /**
   * Build the values statement for Mysql Bulk insert query from Array
   * @param Array
   * @return string
   **/

  static buildValueStatement(data, timestamp) {
    const values = [];
    const now = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    data.forEach((v) => {
      if (timestamp) {
        v.created_at = now;
        v.updated_at = now;
      }

      let columnValues = [];
      const columns = Object.keys(v);
      columns.forEach((colName) => {
        const colVal = v[colName];
        let colModifiedVal = "";
        if (!colVal && colVal !== 0) {
          colModifiedVal = "null";
        } else if (
          typeof colVal === "string" &&
          /^[0-9\.]+$/.test(colVal.trim())
        ) {
          colModifiedVal = parseFloat(colVal.trim());
        } else if (typeof colVal === "number") {
          colModifiedVal = colVal;
        } else if (this.isAQuery(colVal)) {
          colModifiedVal = `(${colVal.toString().trim().replace(/;\s*$/, "")})`;
        } else {
          colModifiedVal =
            "'" + colVal.toString().trim().replace(/'/g, "\\'") + "'";
        }
        columnValues.push(colModifiedVal);
      });
      values.push(columnValues.join(","));
    });
    return `(${values.join("),(")})`;
  }

  static isAQuery(str) {
    return /^(s*?)selects*?.*?s*?from([s]|[^;]|(['\"].*;.*['\"]))*?;s*?$/.test(
      str
    );
  }

  static insertIgnoreQuery(data, table) {
    if (typeof data === "object" && data.constructor.name === "Array") {
      const keys = Object.keys(data[0]);
      const keysString = "`" + keys.join("`,`") + "`";
      const valueString = this.buildValueStatement(data);
      return `INSERT IGNORE INTO ${table} (${keysString}) values ${valueString}`;
    }
    return null;
  }

  static insertUpdateQuery(data, table, updateColumns, timestamp = false) {
    if (typeof data === "object" && data.constructor.name === "Array") {
      const keys = Object.keys(data[0]);
      if (timestamp) {
        keys.push("created_at");
        keys.push("updated_at");
      }
      const keysString = "`" + keys.join("`,`") + "`";
      const valueString = this.buildValueStatement(data, timestamp);
      const updateColArray = [];
      const _updateColumns = updateColumns.slice();
      if (timestamp) {
        _updateColumns.push("updated_at");
      }
      _updateColumns.forEach((updateCol) => {
        updateColArray.push(
          "`" + updateCol + "`=  values(`" + updateCol + "`)"
        );
      });
      const updateColStr = updateColArray.join(",");
      return `INSERT INTO ${table} (${keysString}) values ${valueString} ON DUPLICATE KEY UPDATE ${updateColStr}`;
    }
    return null;
  }
}

module.exports = BulkQueryBuilder;
