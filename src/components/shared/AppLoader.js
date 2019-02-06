import React, {Component} from 'react';

class AppLoader extends Component {

    render() {
      if(this.props.currentUser)
        return <div className="container-block-spiner color-blue"><i className="fa fa-spinner fa-pulse fa-fw"></i></div>;
      else
        return <div className="whole-page-spiner color-blue"><i className="fa fa-spinner fa-pulse fa-fw"></i></div>;
    }
}

export default AppLoader;
