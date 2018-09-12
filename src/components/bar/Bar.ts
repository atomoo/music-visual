export default class Bar {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string | CanvasGradient;

    private canvasCtx: CanvasRenderingContext2D;

    constructor(canvasCtx: CanvasRenderingContext2D, x: number, y: number, height: number, width?: number, fillColor?: string | CanvasGradient) {
        this.canvasCtx = canvasCtx;
        this.x = x;
        this.y = y;
        this.height = height;
        if (width) {
            this.width = width;
        }
        else {
            this.width = 30;
        }
        if (fillColor) {
            this.fillColor = fillColor;
        }
        else {
            this.fillColor = this.canvasCtx.createLinearGradient(0, 255, 0, 0);
            this.fillColor.addColorStop(0, '#00FF00');
            this.fillColor.addColorStop(0, '#FF0000');
        }
    }

    draw() {
        this.canvasCtx.moveTo(this.x, this.y);
        this.canvasCtx.beginPath();
        this.canvasCtx.lineTo(this.x + this.width, this.y);
        this.canvasCtx.lineTo(this.x + this.width, this.y + this.height);
        this.canvasCtx.lineTo(this.x, this.y + this.height);
        this.canvasCtx.closePath();
        this.canvasCtx.fillStyle = this.fillColor;
        this.canvasCtx.fill();
    }
}
