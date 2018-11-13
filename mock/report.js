const {
  map200Data,
} = require('./utils');

const reportList=
{
  "code": "",
  "data": {
      "content": [
        {
          "accounted": false,
          "date": "2018-09",
          "id": 0,
          "name": "string",
          "recorded": true,
          "remark": "string",
        },
        {
            "accounted": false,
            "date": "2018-09",
            "id": 0,
            "name": "string",
            "recorded": false,
            "remark": "string",
          },
          {
            "accounted": false,
            "date": "2018-09",
            "id": 0,
            "name": "string",
            "recorded": true,
            "remark": "string",
          },
        {
          "accounted": false,
          "date": "2018-09",
          "id": 1,
          "name": "string",
          "recorded": true,
          "remark": "string",
        },
        {
          "accounted": false,
          "date": "2018-09",
          "id": 2,
          "name": "string",
          "recorded": false,
          "remark": "string",
        },
      ],
      "first": true,
      "last": true,
      "number": 0,
      "numberOfElements": 0,
      "pageable": {
          "offset": 0,
          "pageNumber": 0,
          "pageSize": 0,
          "paged": true,
          "sort": {
              "sorted": true,
              "unsorted": true,
          },
          "unpaged": true,
      },
      "size": 0,
      "sort": {
          "sorted": true,
          "unsorted": true,
      },
      "totalElements": 0,
      "totalPages": 0,
  },
  "message": "",
}
const getDetails={
  "code": "",
  "data": {
      "content": [
          {
              "employeeId": 0,
              "employeeName": "",
              "employeeNo": "",
              "salaryItemDTO": [
                  {
                      "code": "",
                      "name": "",
                      "value": 0,
                  },
              ],
          },
      ],
      "first": true,
      "last": true,
      "number": 0,
      "numberOfElements": 0,
      "pageable": {
          "offset": 0,
          "pageNumber": 0,
          "pageSize": 0,
          "paged": true,
          "sort": {
              "sorted": true,
              "unsorted": true,
          },
          "unpaged": true,
      },
      "size": 0,
      "sort": {
          "sorted": true,
          "unsorted": true,
      },
      "totalElements": 0,
      "totalPages": 0,
  },
  "message": "",
}
const salaryItem={
  "code": "",
  "data": [
    {'code':'day',
      'name':'天数',
    },
    {'code':'day1',
    'name':'天数1',
    },
    {'code':'day2',
    'name':'天数2',
    },
    {'code':'day3',
    'name':'天数3',
    },
  ],
  "message": "",
}
  module.exports=(app)=>{
    app.get('/api/salaries/records',(req,res)=>{
      res.send(map200Data(reportList))
    })
    app.get('/api/salaries/report/:month',(req,res)=>{
      res.send(map200Data(getDetails))
    })
    app.get('/api/salaries/salary_items',(req,res)=>{
      res.send(map200Data(salaryItem))
    })
  }