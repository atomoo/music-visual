import * as React from 'react';
import {hot} from 'react-hot-loader';
import Audio from './components/audio/Audio';

class AppComponent extends React.Component<{}, {}> {
    render() {
        return <Audio />;
    }
}

export const App = hot(module)(AppComponent);
