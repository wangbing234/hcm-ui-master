import React, { Component } from 'react';
import { Route,Switch } from 'react-router';
import Details from './Details';
import Report from './Report'

class RouterConfig extends Component {
      render(){
         return(
        <Switch>
          <Route exact path="/salary_report" component={Report} />
          <Route exact path="/salary_report/details/:month" component={Details} />
        </Switch>
         )
      
}
}

export default RouterConfig;

// export const RouterConfig = (history)=> (
//       <Router history={history}>
//         <Route path='/details' component={Details} />
//       </Router>
// )