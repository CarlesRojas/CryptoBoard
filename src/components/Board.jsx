import React, { useRef, useEffect, useContext } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import classNames from "classnames";
import Web3 from "web3";

// Contexts
import { Data } from "contexts/Data";

// Constants
const PIXELS_PER_PIXEL = 20;

export default function Board() {
    // Contexts
    const {
        numRows,
        pixelLimit,
        mintedPixels,
        pixels,
        coordsToRowCol,
        rowColToCoords,
        useDarkMode,
        color,
        setColor,
        setSelectedPixel,
        currSelectedPixel,
        getNotMintedColor,
        setMinting,
        setBuying,
        setColorPickerIsValid,
        setEthPriceIsValid,
        setEthPrice,
        notMintedPrice,
    } = useContext(Data);

    // #################################################
    //   CANVAS
    // #################################################

    // Refs
    const boardRef = useRef(null);
    const containerRef = useRef(null);

    // Canvas Size
    const canvasWidth = Math.floor(pixelLimit.current / numRows.current) * PIXELS_PER_PIXEL;
    const canvasHeight = numRows.current * PIXELS_PER_PIXEL;

    // Canvas refs
    const canvasRef = useRef(null);
    const canvasColorRef = useRef(null);
    const canvasHighlightRef = useRef(null);
    const canvasSelectRef = useRef(null);

    // Canvas contexts
    const ctx = useRef(null);
    const ctxColor = useRef(null);
    const ctxHighlight = useRef(null);
    const ctxSelect = useRef(null);

    // Paint a pixel
    const paintPixel = (row, col, color) => {
        ctx.current.fillStyle = color;
        ctx.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, PIXELS_PER_PIXEL, PIXELS_PER_PIXEL);
    };

    // Paint provisional pixel
    const paintProvisionalPixel = (row, col, color) => {
        ctxColor.current.fillStyle = color;
        ctxColor.current.fillRect(col * PIXELS_PER_PIXEL, row * PIXELS_PER_PIXEL, PIXELS_PER_PIXEL, PIXELS_PER_PIXEL);
    };

    // Highlight a pixel
    const highlightPixel = (row, col) => {};

    // Select a pixel
    const selectPixel = (row, col) => {
        // Get new pixel coords
        const newSelectedPixel = rowColToCoords(row, col);

        // Clear canvases
        ctxColor.current.clearRect(0, 0, canvasWidth, canvasHeight);
        // ctxSelect.current.clearRect(0, 0, canvasWidth, canvasHeight);

        // If clicked on the same pixel again, diselect it
        if (currSelectedPixel.current === newSelectedPixel) {
            setSelectedPixel(-1);
            setColor(getNotMintedColor(row, col));
            setEthPrice(notMintedPrice.current);
        }
        // Select pixel
        else {
            // Set the selected pixel
            setSelectedPixel(newSelectedPixel);
            const pixelInfo = pixels.current[newSelectedPixel];

            // Set color and price
            if (pixelInfo) {
                setColor(pixelInfo.color.toLowerCase());
                setEthPrice(Web3.utils.fromWei(pixelInfo.weiPrice.toString(), "Ether").toString());
            } else {
                setColor(getNotMintedColor(row, col));
                setEthPrice(notMintedPrice.current);
            }
        }

        // Cancel minting or buying
        setMinting(false);
        setBuying(false);
        setColorPickerIsValid(true);
        setEthPriceIsValid(true);
    };

    // On mouse move over the canvas
    const onCanvasMouseMove = (event) => {
        // Get row and col
        const pos = {
            col: Math.max(0, Math.min(pixelLimit.current / numRows.current - 1, Math.floor(event.offsetX / currPixelWidth.current))),
            row: Math.max(0, Math.min(numRows.current - 1, Math.floor(event.offsetY / currPixelWidth.current))),
        };

        // Highlight pixel
        highlightPixel(pos.row, pos.col);
    };

    // On mouse leave the canvas
    const onCanvasMouseLeave = () => {
        // Clear the highlight canvas
        ctxHighlight.current.clearRect(0, 0, canvasWidth, canvasHeight);
    };

    // On mouse release over the canvas
    const onCanvasMouseUp = (event) => {
        // Get row and col
        const pos = {
            col: Math.max(0, Math.min(pixelLimit.current / numRows.current - 1, Math.floor(event.offsetX / currPixelWidth.current))),
            row: Math.max(0, Math.min(numRows.current - 1, Math.floor(event.offsetY / currPixelWidth.current))),
        };

        // Highlight pixel
        selectPixel(pos.row, pos.col);
    };

    // On color changed in the chain
    const onChangePixelColorAndPrice = ({ pixelCoords, newColor }) => {
        // Get row and col
        const coords = coordsToRowCol(pixelCoords);

        // Paint the pixel
        paintPixel(coords.row, coords.col, newColor);
    };

    // Paint provisional color when it is updated in the color picker
    useEffect(() => {
        if (currSelectedPixel.current >= 0 && currSelectedPixel.current <= pixelLimit.current) {
            // Get row and col
            const coords = coordsToRowCol(currSelectedPixel.current);
            paintProvisionalPixel(coords.row, coords.col, color);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    // #################################################
    //   RESIZE
    // #################################################

    // Resize timeout
    const resizeTimeout = useRef(null);

    // Current canvas size
    const currPixelWidth = useRef(0);

    // On window resize
    const onResize = (direct) => {
        if (resizeTimeout.current) clearTimeout(resizeTimeout.current);

        if (direct) resizeCanvases();
        else resizeTimeout.current = setTimeout(resizeCanvases, 500);
    };

    // Resize canvases
    const resizeCanvases = () => {
        // Styles
        const boardStyle = window.getComputedStyle(boardRef.current, null);
        const containerStyle = window.getComputedStyle(containerRef.current, null);

        // Get height
        const canvasNewHeight = parseInt(boardStyle.getPropertyValue("height").slice(0, -2)) - parseInt(containerStyle.getPropertyValue("padding-top").slice(0, -2)) * 2;

        // Get width
        const canvasNewWidth = parseInt(boardStyle.getPropertyValue("width").slice(0, -2)) - parseInt(containerStyle.getPropertyValue("padding-left").slice(0, -2)) * 2;

        // Scale to fit height
        if (canvasNewHeight < canvasNewWidth) {
            // Set height
            canvasRef.current.style.height = `${canvasNewHeight}px`;
            canvasColorRef.current.style.height = `${canvasNewHeight}px`;
            canvasHighlightRef.current.style.height = `${canvasNewHeight}px`;
            canvasSelectRef.current.style.height = `${canvasNewHeight}px`;

            // Unset width
            canvasRef.current.style.width = `unset`;
            canvasColorRef.current.style.width = `unset`;
            canvasHighlightRef.current.style.width = `unset`;
            canvasSelectRef.current.style.width = `unset`;

            // Set current pixel width
            currPixelWidth.current = canvasNewHeight / numRows.current;
        }

        // Scale to fit width
        else {
            // Unset height
            canvasRef.current.style.height = `unset`;
            canvasColorRef.current.style.height = `unset`;
            canvasHighlightRef.current.style.height = `unset`;
            canvasSelectRef.current.style.height = `unset`;

            // Set width
            canvasRef.current.style.width = `${canvasNewWidth}px`;
            canvasColorRef.current.style.width = `${canvasNewWidth}px`;
            canvasHighlightRef.current.style.width = `${canvasNewWidth}px`;
            canvasSelectRef.current.style.width = `${canvasNewWidth}px`;

            // Set current pixel width
            currPixelWidth.current = canvasNewWidth / Math.floor(pixelLimit.current / numRows.current);
        }
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
        window.PubSub.sub("changePixelColorAndPrice", onChangePixelColorAndPrice);

        // Resize on load
        onResize(true);

        // Save 2D Contexts
        ctx.current = canvasRef.current.getContext("2d");
        ctxColor.current = canvasColorRef.current.getContext("2d");
        ctxHighlight.current = canvasHighlightRef.current.getContext("2d");
        ctxSelect.current = canvasSelectRef.current.getContext("2d");

        // Paint the canvas with the not minted colors
        for (let i = 0; i < pixelLimit.current; i++) {
            // Get pixel info
            const rowCol = coordsToRowCol(i);
            paintPixel(rowCol.row, rowCol.col, getNotMintedColor(rowCol.row, rowCol.col));
        }

        // Paint canvas with pixels
        for (const coords of mintedPixels.current) {
            // Get pixel info
            const rowCol = coordsToRowCol(coords);
            const pixelInfo = pixels.current[coords];

            // Fill pixels
            paintPixel(rowCol.row, rowCol.col, pixelInfo.color);
        }

        return () => {
            // Unsubscribe from events
            window.removeEventListener("resize", onResize);
            canvasRefEffect.removeEventListener("mousemove", onCanvasMouseMove);
            canvasRefEffect.removeEventListener("mouseleave", onCanvasMouseLeave);
            canvasRefEffect.removeEventListener("mouseup", onCanvasMouseUp);
            window.PubSub.unsub("changePixelColorAndPrice", onChangePixelColorAndPrice);

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
            <div className={classNames("canvasContainer", { dark: useDarkMode })} ref={containerRef}>
                <TransformWrapper pan={{ paddingSize: 0 }} doubleClick={{ mode: "reset" }}>
                    <TransformComponent>
                        <canvas className="canvas" width={canvasWidth} height={canvasHeight} ref={canvasRef}></canvas>

                        <canvas className="canvas overlay" width={canvasWidth} height={canvasHeight} ref={canvasColorRef}></canvas>

                        <canvas className="canvas overlay" width={canvasWidth} height={canvasHeight} ref={canvasSelectRef}></canvas>

                        <canvas className="canvas overlay" width={canvasWidth} height={canvasHeight} ref={canvasHighlightRef}></canvas>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
}
