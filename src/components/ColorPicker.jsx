import React, { useContext, useRef, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import classNames from "classnames";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

export default function ColorPicker() {
    // Contexts
    const { hexToRgb, rgbToHex, isInt } = useContext(Utils);
    const { color, setColor, useDarkMode, setColorPickerIsValid } = useContext(Data);

    // #################################################
    //   INPUTS
    // #################################################

    // RGB initial value
    const initialRGB = hexToRgb(color);

    // Input Values
    const [colorPickerValue, setColorPickerValue] = useState(color);
    const [hexValue, setHexValue] = useState(color);
    const [redValue, setRedValue] = useState(initialRGB.r);
    const [greenValue, setGreenValue] = useState(initialRGB.g);
    const [blueValue, setBlueValue] = useState(initialRGB.b);

    // Input refs
    const hexInputRef = useRef(null);
    const redInputRef = useRef(null);
    const greenInputRef = useRef(null);
    const blueInputRef = useRef(null);

    // Valid
    const [hexIsValid, setHexIsValid] = useState(true);
    const [redIsValid, setRedIsValid] = useState(true);
    const [greenIsValid, setGreenIsValid] = useState(true);
    const [blueIsValid, setBlueIsValid] = useState(true);

    // Set valid color
    const setValidColor = (hex) => {
        const rgb = hexToRgb(hex);

        if (!rgb) return;

        // Color picker value
        setColorPickerValue(hex);

        // Hex value
        setHexValue(hex);

        // RGB values
        setRedValue(rgb.r.toString());
        setGreenValue(rgb.g.toString());
        setBlueValue(rgb.b.toString());

        // All valid
        setHexIsValid(true);
        setRedIsValid(true);
        setGreenIsValid(true);
        setBlueIsValid(true);
        setColorPickerIsValid(true);

        // Set final color
        setColor(hex);
    };

    // Check if hex code is a valid color
    const checkHexColor = (hex) => {
        var isValid = false;

        if (typeof hex === "string" && hex.length === 7 && hex.charAt(0) === "#") {
            // Remove #
            hex = hex.substring(1);

            // Check if it is valid hex number
            isValid = !isNaN(Number("0x" + hex));
        }

        return isValid;
    };

    // Check if r, g or b are valid
    const checkRGBColor = (num) => {
        var isValid = true;

        let isNum = isInt(num);
        const number = parseInt(num);
        if (!isNum || number < 0 || number > 255) isValid = false;

        return isValid;
    };

    // Update all when the final color is updated
    const colorEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (colorEffectFirstRun.current) return (colorEffectFirstRun.current = false);

        setValidColor(color);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    // Update all when hex input is updated and valid
    const hexValueEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (hexValueEffectFirstRun.current) return (hexValueEffectFirstRun.current = false);

        const valid = checkHexColor(hexValue);
        if (valid) setValidColor(hexValue);
        else {
            setHexIsValid(false);
            setColorPickerIsValid(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hexValue]);

    // Update all when red input is updated and all the rgb are valid
    const redValueEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (redValueEffectFirstRun.current) return (redValueEffectFirstRun.current = false);

        const valid = checkRGBColor(redValue);
        if (valid && greenIsValid && blueIsValid) setValidColor(rgbToHex(parseInt(redValue), parseInt(greenValue), parseInt(blueValue)));
        else {
            setRedIsValid(false);
            setColorPickerIsValid(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redValue]);

    // Update all when green input is updated and all the rgb are valid
    const greenValueEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (greenValueEffectFirstRun.current) return (greenValueEffectFirstRun.current = false);

        const valid = checkRGBColor(greenValue);
        if (redIsValid && valid && blueIsValid) setValidColor(rgbToHex(parseInt(redValue), parseInt(greenValue), parseInt(blueValue)));
        else {
            setGreenIsValid(false);
            setColorPickerIsValid(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [greenValue]);

    // Update all when blue input is updated and all the rgb are valid
    const blueValueEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (blueValueEffectFirstRun.current) return (blueValueEffectFirstRun.current = false);

        const valid = checkRGBColor(blueValue);
        if (redIsValid && greenIsValid && valid) setValidColor(rgbToHex(parseInt(redValue), parseInt(greenValue), parseInt(blueValue)));
        else {
            setBlueIsValid(false);
            setColorPickerIsValid(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blueValue]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="colorPicker">
            <HexColorPicker color={colorPickerValue} onChange={setValidColor} />

            <div className="inputs">
                <div className="container">
                    <p className="title">HEX</p>
                    <input
                        type="text"
                        className={classNames("input", { invalid: !hexIsValid }, { dark: useDarkMode })}
                        value={hexValue}
                        onChange={(e) => setHexValue(e.target.value)}
                        ref={hexInputRef}
                        maxLength="7"
                        spellCheck="false"
                    />
                </div>

                <div className="container">
                    <p className="title">R</p>
                    <input
                        type="text"
                        className={classNames("input", { invalid: !redIsValid }, { dark: useDarkMode })}
                        value={redValue}
                        onChange={(e) => setRedValue(e.target.value.toString())}
                        ref={redInputRef}
                        maxLength="3"
                        spellCheck="false"
                    />
                </div>

                <div className="container">
                    <p className="title">G</p>
                    <input
                        type="text"
                        className={classNames("input", { invalid: !greenIsValid }, { dark: useDarkMode })}
                        value={greenValue}
                        onChange={(e) => setGreenValue(e.target.value.toString())}
                        ref={greenInputRef}
                        maxLength="3"
                        spellCheck="false"
                    />
                </div>

                <div className="container">
                    <p className="title">B</p>
                    <input
                        type="text"
                        className={classNames("input", { invalid: !blueIsValid }, { dark: useDarkMode })}
                        value={blueValue}
                        onChange={(e) => setBlueValue(e.target.value.toString())}
                        ref={blueInputRef}
                        maxLength="3"
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
}
