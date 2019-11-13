const ee = require("../lib/eventEmitter");
const { getStatusColor } = require("../constant/statusColor");

const createPulsingDot = function (user) {
    const size = 120;
    return {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: function () {
            const canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext("2d");
        },

        render: function () {
            if(window.state.user && window.state.user.username) {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = size / 2 * 0.3;
                const outerRadius = size / 2 * 0.7 * t + radius;
                const context = this.context;
                // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
                const rgbArr = getStatusColor(user.status, user.username === window.state.user.username, false);
                context.fillStyle = `rgba(${rgbArr.join(",")},${(1 - t)})`;
                context.fill();
                // draw inner circle
                context.beginPath();
                context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
                context.fillStyle = getStatusColor(user.status, user.username === window.state.user.username, true);
                context.strokeStyle = "white";
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();
                // update this image's data with data from the canvas
                this.data = context.getImageData(0, 0, this.width, this.height).data;
                // keep the map repainting
                window.map.triggerRepaint();
                // return `true` to let the map know that the image was updated
                return true;
            }
        }
    };
};

const buildSourceData = function (coord) {
    return {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coord
            }
        }]
    };
};

const setDot = function (user, coord) {
    const id = user.username;
    if(window.map.hasImage(id)) {
        window.map.updateImage(id, createPulsingDot(user));
    } else {
        window.map.addImage(id, createPulsingDot(user), { pixelRatio: 2 });
    }

    if(window.map.getSource(id)) {
        window.map.getSource(id).setData(buildSourceData(coord));
    } else {
        window.map.addSource(id, {
            type: "geojson",
            data: buildSourceData(coord)
        });
    }

    if(!window.map.getLayer(id)) {
        window.map.addLayer({
            "id": id,
            "type": "symbol",
            "source": id,
            "layout": {
                "icon-image": id,
                "icon-allow-overlap": true
            },
        });
        window.map.on("click", id, (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            while(Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            console.log("Click: " + id);
            ee.emit("CLICK_DOT", id);
        });
        window.map.on("mouseenter", id, () => {
            window.map.getCanvas().style.cursor = "pointer";
        });

        window.map.on("mouseleave", id, () => {
            window.map.getCanvas().style.cursor = "";
        });
    }
};

const setDotCoord = function (user, coord) {
    window.map.getSource(user.username).setData({
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coord
            }
        }]
    });
};

const updateDotColor = function (user) {

};

module.exports = {
    createPulsingDot,
    setDot,
    setDotCoord,
    updateDotColor
};
