const { map200Data } = require('./utils');

const basic = [];
const other = [];
const position = [];

for (let i = 0; i < 10; ) {
  other.push({
    id: i + 1,
    title: `otherForms${i}`,
    multipleRecord: true,
    required: true,
    onBoard: true,
    statues: true,
  });
  position.push({
    id: i + 2,
    title: `positionForms${i}`,
    multipleRecord: true,
    required: true,
    onBoard: true,
    statues: true,
  });
  i += 1;
}
const getPersonnel = {
  basic,
  other,
  position,
};
const deletePersonnel = {};
const activePersonnel = {};

module.exports = (app) => {
	app.get('/api/employees/customized_forms', (req, res) => {
		res.send(map200Data(getPersonnel)); // getPersonnel
	});
	app.delete('/api/employees/customized_forms/:id', (req, res) => {
		res.send(map200Data(deletePersonnel)); // deletePersonnel
	});
	app.put('/api/employees/customized_forms/:id/toggle_active', (req, res) => {
		res.send(map200Data(activePersonnel)); // activePersonnel
	});
}
