const fields = require("./fields");
const payload = (symptoms) => {
  let values = new Array(fields.length).fill(0);
  for (let i = 0; i < symptoms.length; i++) {
    let index = fields.indexOf(symptoms[i]);
    values[index] = 1;
  }

  return { fields, values };
};

module.exports = payload;
