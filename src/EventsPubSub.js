export default class EventsPubSub {
    events = {};

    sub(eventName, func) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(func);
    }

    unsub(eventName, func) {
        if (this.events[eventName])
            for (var i = 0; i < this.events[eventName].length; i++)
                if (this.events[eventName][i] === func) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
    }

    emit(eventName, data) {
        if (this.events[eventName])
            this.events[eventName].forEach(function (func) {
                func(data);
            });
    }
}

/*
#######################################
     EVENTS
#######################################

    {
        event:          testName
        desciption:     Event description
        parameters:     { param1, param2 }
        param1:         Param1 description
        param2:         Param2 description
    },
    {
        event:          changePixelColorAndPrice
        desciption:     Emited then the color of a pixel has been succesfully changed
        parameters:     { pixelCoords, newColor, newEthPrice }
        pixelCoords:    Num -> Coords of the pixel
        newColor:       String -> Color code
        newEthPrice:    Num -> Price in wei
    },
    {
        event:          pixelHasBeenObtained
        desciption:     Emited then a pixel has been bought
        parameters:     { pixelCoords }
        pixelCoords:    Num -> Coords of the bought pixel
    },
*/
