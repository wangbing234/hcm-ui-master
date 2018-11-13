import React, { PureComponent } from 'react';

import { SALARY_INFO_LAYOUT } from 'constants/salary';

import withFetch from 'decorators/withFetch';

import { actions } from 'models/salary';

import InfoCard from 'routes/Employee/Detail/InfoCard';

import SalaryFormLayout from './SalaryFormLayout';

// import styles from './Detail.less';

const {
  GET_DETAIL_SALARY,
} = actions;

@withFetch(GET_DETAIL_SALARY, ({salary}) => ({
  detailSalary: salary.detailSalary,
}))
export default class SalaryInfo extends PureComponent {

  render() {
    const { detailSalary } = this.props;
    if( !detailSalary ) {
      return null;
    }
    return SALARY_INFO_LAYOUT.map( ({ id, title, formField }) => (
      <InfoCard key={id} title={title} onEdit={() => {}}>
        <SalaryFormLayout formField={formField} data={detailSalary[id]} isView/>
      </InfoCard>
    ));
  }

}
