import * as React from 'react';
import Bar from '../bar/Bar';
import * as audioSource from './rainbow.mp3';

export default class AppComponent extends React.Component<{}, {}> {
    private audioRef = React.createRef<HTMLMediaElement>();
    private visualRef = React.createRef<HTMLCanvasElement>();
    private audioCtx: AudioContext;
    private analyser: AnalyserNode;
    private canvasCtx: CanvasRenderingContext2D;

    constructor(props: any) {
        super(props);
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
    }

    componentDidMount() {
        const source = this.audioCtx.createMediaElementSource(this.audioRef.current);
        source.connect(this.analyser);
        source.connect(this.audioCtx.destination);
        this.canvasCtx = this.visualRef.current.getContext('2d');
        this.draw();
    }

    draw = () => {
        if (!this.audioRef.current.paused) {
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
        }
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    render() {
        return (
            <React.Fragment>
                <canvas ref={this.visualRef} style={{width: 1200, height: 600}}/>
                <audio ref={this.audioRef} src={audioSource} controls />
                <a href="https://music.163.com/#/song?id=27646215" target="blank" style={{display: 'block'}}>彩虹山-文雀乐队Sparrow</a>
            </React.Fragment>
        );
    }
}
