import React, { PureComponent } from 'react';

import withFetch from 'decorators/withFetch';

import { actions } from 'models/salary';

import InfoCard from 'routes/Employee/Detail/InfoCard';

// import styles from './Detail.less';

const {
  GET_DETAIL_MONTHLY,
} = actions;

@withFetch(GET_DETAIL_MONTHLY, ({salary}) => ({
  detailMonthly: salary.detailMonthly,
}))
export default class MonthlyDetail extends PureComponent {

  render() {
    const { detailMonthly } = this.props;
    if( !detailMonthly ) {
      return null;
    }
    return [
      <InfoCard title='本月明细' onEdit={() => {}}  />,
    ];
  }

}
