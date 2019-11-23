const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyC7Rj7OsUCjrrjxnRgbSLz0k-zjP4HdT7c",
    Promise: Promise
});

const geocode = async function (req, res) {
    const context = req.params.keywords || req.query.keywords;
    googleMapsClient.placesNearby({ location: [37.408342, -122.058863], rankby: "distance", type: context })
        .asPromise()
        .then((response) => {
            res.status(200).json({
                success: true,
                message: "Get Nearby Places",
                results: response.json.results
            });
        });
};

module.exports = geocode;