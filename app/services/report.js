import request from '../utils/request';

export function getReport(payload){
        const {month} = payload;
        const body = payload;
        delete body.month;
        return request(`/api/salaries/report/${month}`,{
            method: 'GET',
            payload,
          })
    }
export function accounting(){
    return request('/api/salaries/accounting',{
        method:'PUT',
    })
}
export function accountCancel(){
    return request('/api/salaries/accounting_cancel',{
        method:'PUT',
    })
}
export function getRecords(payload){
    return request('/api/salaries/records',{
        method: 'GET',
        body:payload,
      })
}
export function salaryItem(){
    return request('/api/salaries/salary_items',{
        method: 'GET',
      })
}
export function exportExcel(){
    return request('/api/salaries/export',{
        method: 'GET',
      })
}
export function records(){
    return request('/api/salaries/records',{
        method: 'POST',
      })
}
