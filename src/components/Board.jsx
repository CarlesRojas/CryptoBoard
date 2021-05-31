import React, { useRef, useEffect, useContext } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Contexts
import { Data } from "contexts/Data";

// Constants
const PIXELS_PER_PIXEL = 20;

export default function Board() {
    // Contexts
    const { numRows, pixelCount, pixels, coordsToRowCol } = useContext(Data);

    // #################################################
    //   CANVAS
    // #################################################

    // Refs
    const boardRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasHighlightRef = useRef(null);
    const canvasSelectRef = useRef(null);
    const ctx = useRef(null);
    const ctxHighlight = useRef(null);
    const ctxSelect = useRef(null);

    // Paint a pixel
    const paintPixel = (row, col, color) => {
        ctx.current.fillStyle = color;
        ctx.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, PIXELS_PER_PIXEL, PIXELS_PER_PIXEL);
    };

    // Highlight a pixel
    const highlightPixel = (row, col) => {
        // Clear canvas
        ctxHighlight.current.clearRect(0, 0, Math.floor(pixelCount.current / numRows.current) * PIXELS_PER_PIXEL, numRows.current * PIXELS_PER_PIXEL);

        // Highlight pixel outline black
        ctxHighlight.current.fillStyle = "black"; // getMostContrastedColor(currentPixelColor, "white", "black");
        ctxHighlight.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, PIXELS_PER_PIXEL, 1);
        ctxHighlight.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, 1, PIXELS_PER_PIXEL);
        ctxHighlight.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL + PIXELS_PER_PIXEL - 1, PIXELS_PER_PIXEL, 1);
        ctxHighlight.current.fillRect(col * PIXELS_PER_PIXEL + PIXELS_PER_PIXEL - 1, row * PIXELS_PER_PIXEL, 1, PIXELS_PER_PIXEL);
    };

    // Select a pixel
    const selectPixel = (row, col) => {
        // Clear canvas
        ctxSelect.current.clearRect(0, 0, Math.floor(pixelCount.current / numRows.current) * PIXELS_PER_PIXEL, numRows.current * PIXELS_PER_PIXEL);

        // Highlight pixel outline black
        ctxSelect.current.fillStyle = "black"; // getMostContrastedColor(currentPixelColor, "white", "black");
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, PIXELS_PER_PIXEL, 1);
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, 1, PIXELS_PER_PIXEL);
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL + PIXELS_PER_PIXEL - 1, PIXELS_PER_PIXEL, 1);
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL + PIXELS_PER_PIXEL - 1, row * PIXELS_PER_PIXEL, 1, PIXELS_PER_PIXEL);

        // Highlight pixel outline white
        ctxSelect.current.fillStyle = "white";
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL - 1, row * PIXELS_PER_PIXEL - 1, PIXELS_PER_PIXEL + 2, 1);
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL - 1, row * PIXELS_PER_PIXEL - 1, 1, PIXELS_PER_PIXEL + 2);
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL - 1, row * PIXELS_PER_PIXEL + PIXELS_PER_PIXEL, PIXELS_PER_PIXEL + 2, 1);
        ctxSelect.current.fillRect(col * PIXELS_PER_PIXEL + PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL - 1, 1, PIXELS_PER_PIXEL + 2);
    };

    // On mouse move over the canvas
    const onCanvasMouseMove = (event) => {
        const pixelWidth = currCanvasHeight.current / numRows.current;

        // Get row and col
        const pos = {
            col: Math.max(0, Math.min(pixelCount.current / numRows.current - 1, Math.floor(event.offsetX / pixelWidth))),
            row: Math.max(0, Math.min(numRows.current - 1, Math.floor(event.offsetY / pixelWidth))),
        };

        // Highlight pixel
        highlightPixel(pos.row, pos.col);
    };

    // On mouse leave the canvas
    const onCanvasMouseLeave = () => {
        // Clear the highlight canvas
        ctxHighlight.current.clearRect(0, 0, Math.floor(pixelCount.current / numRows.current) * PIXELS_PER_PIXEL, numRows.current * PIXELS_PER_PIXEL);
    };

    // On mouse release over the canvas
    const onCanvasMouseUp = (event) => {
        const pixelWidth = currCanvasHeight.current / numRows.current;

        // Get row and col
        const pos = {
            col: Math.max(0, Math.min(pixelCount.current / numRows.current - 1, Math.floor(event.offsetX / pixelWidth))),
            row: Math.max(0, Math.min(numRows.current - 1, Math.floor(event.offsetY / pixelWidth))),
        };

        // Highlight pixel
        selectPixel(pos.row, pos.col);
    };

    // #################################################
    //   RESIZE
    // #################################################

    // Resize timeout
    const resizeTimeout = useRef(null);

    // Current height
    const currCanvasHeight = useRef(0);

    // On window resize
    const onResize = (direct) => {
        if (resizeTimeout.current) clearTimeout(resizeTimeout.current);

        if (direct) resizeCanvases();
        else {
            resizeTimeout.current = setTimeout(resizeCanvases, 500);
        }
    };

    // Resize canvases
    const resizeCanvases = () => {
        // Parent height
        const parentStyle = window.getComputedStyle(boardRef.current, null);
        const parentHeight = parseInt(parentStyle.getPropertyValue("height").slice(0, -2)) - parseInt(parentStyle.getPropertyValue("padding-top").slice(0, -2)) * 2;
        currCanvasHeight.current = parentHeight;

        // Resize
        canvasRef.current.style.height = `${parentHeight}px`;
        canvasHighlightRef.current.style.height = `${parentHeight}px`;
        canvasSelectRef.current.style.height = `${parentHeight}px`;
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        // Save canvases
        const canvasRefEffect = canvasRef.current;

        // Subscribe to events
        window.addEventListener("resize", onResize);
        canvasRefEffect.addEventListener("mousemove", onCanvasMouseMove);
        canvasRefEffect.addEventListener("mouseleave", onCanvasMouseLeave);
        canvasRefEffect.addEventListener("mouseup", onCanvasMouseUp);
        onResize(true);

        // Save 2D Contexts
        ctx.current = canvasRef.current.getContext("2d");
        ctxHighlight.current = canvasHighlightRef.current.getContext("2d");
        ctxSelect.current = canvasSelectRef.current.getContext("2d");

        // Paint canvas with pixels
        for (const pixel of pixels.current) {
            const coords = coordsToRowCol(pixel.coords);

            // Fill pixels
            paintPixel(coords.row, coords.col, pixel.color);
        }

        return () => {
            // Unsubscribe from events
            window.removeEventListener("resize", onResize);
            canvasRefEffect.removeEventListener("mousemove", onCanvasMouseMove);
            canvasRefEffect.removeEventListener("mouseleave", onCanvasMouseLeave);
            canvasRefEffect.removeEventListener("mouseup", onCanvasMouseUp);

            // Clear timeouts
            if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="board" ref={boardRef}>
            <TransformWrapper>
                <TransformComponent>
                    <canvas
                        className="canvas"
                        width={Math.floor(pixelCount.current / numRows.current) * PIXELS_PER_PIXEL}
                        height={numRows.current * PIXELS_PER_PIXEL}
                        ref={canvasRef}
                        style={{ zIndex: 0 }}
                    ></canvas>

                    <canvas
                        className="canvas overlay"
                        width={Math.floor(pixelCount.current / numRows.current) * PIXELS_PER_PIXEL}
                        height={numRows.current * PIXELS_PER_PIXEL}
                        ref={canvasHighlightRef}
                        style={{ zIndex: 1 }}
                    ></canvas>

                    <canvas
                        className="canvas overlay"
                        width={Math.floor(pixelCount.current / numRows.current) * PIXELS_PER_PIXEL}
                        height={numRows.current * PIXELS_PER_PIXEL}
                        ref={canvasSelectRef}
                        style={{ zIndex: 2 }}
                    ></canvas>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
