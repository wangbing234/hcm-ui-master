import React from 'react';
import { Button } from 'components/Base';

export default function(props){
  const { handleSubmit, isSubmitting } = props;
  return(
    <Button
      display="block"
      type="primary"
      size="large"
      onClick={handleSubmit}
      loading={isSubmitting}
    >
      {isSubmitting ? '登录中...' : '登录'}
    </Button>
  )
}
