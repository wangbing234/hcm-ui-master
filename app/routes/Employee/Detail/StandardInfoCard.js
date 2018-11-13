import React, { PureComponent } from 'react';

import EmployeeFormLayout from './EmployeeFormLayout';

import InfoCard from './InfoCard';

export default class StandardInfoCard extends PureComponent {
  render() {
    const {
      createFieldElement,
      isView,
      id,
      data,
      error,
      fields,
      onChange,
      onError,
      getFieldValue,
      companyTree,
      ...cardProps
    } = this.props;
    return (
      <InfoCard id={id} data={data} {...cardProps}>
        {data.map((item, idx) => (
          <EmployeeFormLayout
            key={item.get('_key')}
            isView={isView}
            formField={fields}
            data={item}
            error={(error || [])[idx]}
            onChange={onChange}
            onError={onError}
            id={id}
            idx={+idx}
            getFieldValue={getFieldValue}
          />
        ))}
      </InfoCard>
    );
  }
}
