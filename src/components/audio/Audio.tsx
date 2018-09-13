import * as React from 'react';
import Bar from '../bar/Bar';
import * as audioSource from './rainbow.mp3';

interface AppStateInterface {
    audioSupport: boolean
}

export default class AppComponent extends React.Component<{}, AppStateInterface> {
    private audioRef = React.createRef<HTMLMediaElement>();
    private visualRef = React.createRef<HTMLCanvasElement>();
    private audioCtx: AudioContext;
    private analyser: AnalyserNode;
    private canvasCtx: CanvasRenderingContext2D;
    private dataArray: Uint8Array;
    private scale: number;
    private barGap: number = 3;
    private barWidth: number = 10;
    private countOfBar: number;
    private barItems: Array<Bar> = [];

    constructor(props: any) {
        super(props);
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.state = {
            audioSupport: !!AudioContextClass
        };
    }

    componentDidMount() {
        const source = this.audioCtx.createMediaElementSource(this.audioRef.current);
        source.connect(this.analyser);
        source.connect(this.audioCtx.destination);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.canvasCtx = this.visualRef.current.getContext('2d');
        this.countOfBar = (this.visualRef.current.width + this.barGap) / (this.barWidth + this.barGap)
        this.scale = this.analyser.frequencyBinCount / this.countOfBar;
        this.draw();
    }

    clearCanvas = () => {
        this.canvasCtx.clearRect(0, 0, this.visualRef.current.width, this.visualRef.current.height);
    }

    draw = () => {
        if (this.audioRef.current.ended) {
            this.clearCanvas();
            this.barItems = [];
        }
        if (!this.audioRef.current.paused) {
            this.clearCanvas();
            this.analyser.getByteFrequencyData(this.dataArray);
            for (let index = 0; index < this.countOfBar; index++) {
                const data = this.dataArray[Math.floor(index * this.scale)]
                if (this.barItems[index]) {
                    this.barItems[index].height = data;
                }
                else {
                    const bar = new Bar(
                        this.canvasCtx,
                        index * (this.barWidth + this.barGap), this.visualRef.current.height - 100,
                        data, this.barWidth)
                    this.barItems[index] = bar;
                }
                this.barItems[index].draw()
            }
        }
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    render() {
        return this.state.audioSupport
        ? (
            <React.Fragment>
                <canvas ref={this.visualRef} width={1200} height={600} />
                <audio ref={this.audioRef} src={audioSource} controls preload="auto" />
                <a href="https://music.163.com/#/song?id=27646215" target="blank" style={{display: 'block'}}>彩虹山-文雀乐队Sparrow</a>
            </React.Fragment>
        )
        : <p>换个浏览器吧</p>
    }
}
