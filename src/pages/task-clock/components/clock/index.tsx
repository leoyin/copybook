import React, { useEffect } from 'react';
import 'antd-mobile/dist/antd-mobile.css';  // or 'antd-mobile/dist/antd-mobile.less'
import '.'
import './index.scss';
import { drawClockBlank, drawClockPointer } from './utils';
declare var window: any;
interface IProps {
  data: Clock.Task[]
}
const Clock: React.FC<IProps> = (props) => {
  const { data } = props
  useEffect(() => {
    const canvas: HTMLCanvasElement = document.querySelector(".clock-canvas") || document.createElement("canvas")
    const ctx = canvas.getContext("2d");
    canvas.width = Math.min(window.innerWidth, window.innerHeight)-20
    canvas.height = Math.min(window.innerWidth, window.innerHeight)-20
    let requestID: number;
    if (ctx) {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      const zX = w / 2;
      const zY = h / 2;
      ctx.translate(zX, zY);
      const LayerBack = document.createElement("canvas");
      LayerBack.width = w;
      LayerBack.height = h;
      const ctxLayerBack = LayerBack.getContext("2d");
      const radius = Math.min(w, h) / 2 * .9 - 20;
      if (ctxLayerBack) {
        ctxLayerBack.translate(zX, zY)
        drawClockBlank(ctxLayerBack, { radius });
      }

      const LayerPointer = document.createElement("canvas");
      LayerPointer.width = w;
      LayerPointer.height = h;
      const ctxLayerPointer = LayerPointer.getContext("2d");
      if (ctxLayerPointer) {
        ctxLayerPointer.translate(zX, zY)
      }
      const drawShand = () => {
        if (ctx) {
          ctx.clearRect(-zX, -zY, 2 * zX, 2 * zY);
          if (ctxLayerPointer) {
            ctxLayerPointer.clearRect(-zX, -zY, 2 * zX, 2 * zY);
            drawClockPointer(ctxLayerPointer, {
              radius,
              taskList:data
            });
          }
          ctx.globalCompositeOperation = "destination-over"
          ctx.drawImage(LayerPointer, -zX, -zY)
          ctx.drawImage(LayerBack, -zX, -zY)
        }
        requestID = requestAnimationFrame(drawShand)
      }
      drawShand()
    }
    return () => {
      cancelAnimationFrame(requestID)
      // clearImmediate(rafHandler)
    }
  }, [data])
  return (
    <div>
      <div id="img-container" style={{ display: "none" }}></div>
      <canvas className='clock-canvas'>
      </canvas>
    </div>

  );
}

export default Clock;
