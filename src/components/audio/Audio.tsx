import * as React from 'react';
import * as audioSource from './rainbow.mp3';

export default class AppComponent extends React.Component<{}, {}> {
    render() {
        return <audio src={audioSource} controls />;
    }
}
