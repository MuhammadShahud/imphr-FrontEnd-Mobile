import { DrawerItem } from '@react-navigation/drawer';
import React from 'react';

class DrawerComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <DrawerItem {...this.props} />
            </React.Fragment>
        )
    }

}

export default DrawerComponent;