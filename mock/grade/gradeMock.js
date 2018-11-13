const content = [];
for (let i = 0; i < 20; ) {
  content.push({
    address: '',
    alias: `alias${i}`,
    code: `code${i}`,
    enable: false,
    enableTime: '',
    id: i + 1,
    name: `name${i}`,
    parentId: i && `${i}`,
    parentName: `parentName${i}`,
    registerAddress: '',
  });
  i += 1;
}

const getGrades = {
  content,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  pageable: {
    offset: 0,
    pageNumber: 1,
    pageSize: 20,
    paged: true,
    sort: {
      sorted: true,
      unsorted: true,
    },
    unpaged: true,
  },
  size: 0,
  sort: {
    sorted: true,
    unsorted: true,
  },
  totalElements: content.length,
  totalPages: 2,
};

function map200Data(data) {
  return {
    code: 200,
    data,
    message: 'SUCCESS',
  };
}

module.exports = (app) => {
	app.post('/api/grade', (req, res) => {
		res.send(map200Data({})); // createGrade
	});
	app.put('/api/grade', (req, res) => {
		res.send(map200Data({})); // updateGrade
	});
	app.delete('/api/grade/:id', (req, res) => {
		res.send(map200Data({})); // deleteGrade
	});
	app.post('/api/grade/enable/:id', (req, res) => {
		res.send(map200Data({})); // inactiveGrade
	});
	app.get('/api/grade', (req, res) => {
		res.send(map200Data(getGrades)); // getGrades
	});
}
