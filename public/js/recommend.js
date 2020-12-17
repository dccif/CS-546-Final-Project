(function ($) {
    var recommendPicsDivOrigin = $('#recommendPics-div-origin');
    var recommendPicsDivMore = $('#recommendPics-div-more');
    var moreButton = $('#more-button');

    /*
        Like here button, for the original page
    */
    $('.go-here').each(function () {
        $(this).on('click', function (event) {
            event.preventDefault();

            if ($(this).text() == 'Added to your plan') {
                return alert('You have already added this place!');
            }

            // var thisPlaceData = {
            //     name: $(this).prev().prev().prev().prev().prev().prev().prev().text(),
            //     duration: $(this).prev().prev().prev().prev().prev().prev().text().split(': ')[1],
            //     location: $(this).prev().prev().prev().text().replace('wv__', '').replaceAll('_', ' '),
            //     coordinates: $(this).prev().prev().prev().prev().prev().children().text()
            // }
            var thisName = $(this).prev().prev().prev().prev().prev().prev().prev().text();

            var requestSearchPlace = {
                method: 'GET',
                url: `/plan/getPlace/${thisName}`
            }

            $.ajax(requestSearchPlace)
                .then(function (responseSearchPlace) {
                    // responseSearchPlace = {
                    //     "candidates" : [
                    //         {
                    //             "formatted_address": "4 Jingshan Front St, Dongcheng, Beijing, China, 100009",
                    //             "geometry": {
                    //                 "location": {
                    //                     "lat": 39.9163447,
                    //                     "lng": 116.3971546
                    //                 },
                    //                 "viewport": {
                    //                     "northeast": {
                    //                         "lat": 39.91769452989272,
                    //                         "lng": 116.3985044298927
                    //                     },
                    //                     "southwest": {
                    //                         "lat": 39.91499487010728,
                    //                         "lng": 116.3958047701073
                    //                     }
                    //                 }
                    //             },
                    //             "name": "The Palace Museum",
                    //             "plus_code": {
                    //                 "compound_code": "W98W+GV Dongcheng, Beijing, China",
                    //                 "global_code": "8PFRW98W+GV"
                    //             }
                    //         }
                    //     ],
                    //         "status" : "OK"
                    // };
                    let place = responseSearchPlace.candidates[0];
                    let name = place.name;
                    let latitude = place.geometry.location.lat;
                    let longitude = place.geometry.location.lng;
                    let splitedArray = place.plus_code.compound_code.split(',');
                    let location_id = splitedArray[splitedArray.length - 2].split(' ')[1];
                    let duration = (parseInt(6 * Math.random()) + 1) * 30;

                    var node = {
                        name: name,
                        location_id: location_id.trim(),
                        duration: duration,
                        coordinates: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    }
                    var requestConfig = {
                        method: 'POST',
                        url: '/plan/addPlaceFromRecommend',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            thisPlaceData: node,
                        })
                    };
                    $.ajax(requestConfig).then(function (responseMessage) {
                        dataToMakePlan = responseMessage;
                        console.log(dataToMakePlan);
                        // recommendPicsDivMore.html(responseMessage.message);
                    })
                })
            $(this).text('Added to your plan');
        })
    })


    /*
        If the user don't like the places on this page, click this button to get another group of pages.
        Button text is "More" or "Not here", depends on the places of this page is in seperate locations or at one same location,
        the later one can only be generated by click "See more around this place" button.
    */
    moreButton.on('click', function (event) {
        event.preventDefault();

        /*
            Use different search tags to get data of different places.
        */
        const tagsLabels = [
            "subtype-Active_volcanoes|adrenaline",
            "poitype-Massage|poitype-Mountain",
            "music|poitype-Cafe",
            "poitype-Club|poitype-Convention_centre",
            "poitype-Cave|poitype-Canal",
            "poitype-Casino|poitype-Castle",
            "poitype-Cliff|poitype-Church|climate",
            "feature|hidden-Expensive|fishing",
            "sightseeing|poitype-Skyscraper",
            "sailing|poitype-Shipwrecks",
            "poitype-Fountain|golf",
            "poitype-Sight|poitype-Street",
            "poitype-Volcano|poitype-Tomb",
            "amusementparks|poitype-Bar|poitype-Canyon",
            "art|poitype-Art_gallery|architecture",
            "subtype-Natural_history_museums|poitype-Petting_zoo",
            "air|subtype-Football_stadiums|poitype-Park",
            "hiking|character-Crowded",
            "character-Quiet|wildlife",
            "poitype-Obelisk|rafting",
            "relaxinapark|poitype-River_cruise",
            "poitype-Shrine|showstheatresandmusic",
            "poitype-Shopping_centre|shopping",
            "poitype-Shopping_district|poitype-Tower",
            "poitype-Tunnel|poitype-Valley",
            "poitype-View_point|poitype-Water_ski",
            "poitype-Watermill|poitype-Waterfall",
            "watersports|character-Wheelchair_friendly",
            "poitype-Windmill|wintersport",
            "poitype-Wilderness_hut|whalewatching",
            "poitype-Wayside_shrine|zoos",
            "poitype-Theatre|poitype-Temple",
            "character-Romantic|poitype-Royal_guard",
            "poitype-Rock|riding",
            "cruises|sailing",
            "subtype-Sci-tech_museums|character-Shingle_beach",
            "poitype-Prison|poitype-Red-light_district",
            "private_tours|poitype-Pyramid",

        ]

        let index = Math.round(tagsLabels.length * Math.random());
        searchTag = tagsLabels[index];

        var requestConfig = {
            method: 'GET',
            url: `https://www.triposo.com/api/20201111/poi.json?tag_labels=${searchTag}&account=T9TV2POT&token=2wve45tezxoq0kvv3dpd4odygaeb50rq`
        };

        $.ajax(requestConfig).then(function (responseMessage) {

            var picData = $(responseMessage);
            if (picData) {
                recommendPicsDivOrigin.hide();
                recommendPicsDivMore.empty();
                recommendPicsDivMore.show();
            }

            var dataLists = queryLists(picData[0]);
            if (dataLists) {

                var newDiv = [];
                for (let i = 0; i < dataLists.length; i++) {
                    var targetPic = dataLists[i];
                    var validatedUrl;
                    if (!targetPic.url.source_url) { //Sometimes no image source
                        validatedUrl = "public/image/no_image.jpeg";
                    } else {
                        validatedUrl = targetPic.url.source_url;
                    }
                    recommendPicsDivMore.append(`<div class="more-around-div"></div>`);

                    if (i == 0) {
                        newDiv[i] = recommendPicsDivMore.children('div');
                    } else {
                        newDiv[i] = newDiv[i - 1].next();
                    }

                    newDiv[i].append(`<img src=${validatedUrl} alt=${targetPic.name} width="384" height="216" class="image">`);
                    newDiv[i].append(`<p>${targetPic.name}</p>`);
                    newDiv[i].append(`<p>Duration: ${targetPic.duration} minutes</p>`);
                    newDiv[i].append(`<ul>Coordinates: </ul>`);
                    newDiv[i].find('ul').append(`<li>Latitude: ${targetPic.coordinates.latitude}</li>`);
                    newDiv[i].find('ul').append(`<li>Latitude: ${targetPic.coordinates.longitude}</li>`);
                    newDiv[i].append(`<span>Location: </span><p class="location-p">${targetPic.location_id}</p>`);
                    newDiv[i].append(`<p>Description: ${targetPic.snippet}</p>`);
                    newDiv[i].append(`<button class="more-around btn btn-outline-primary">See more around this place</button>`);
                    newDiv[i].append(`<button class="go-here btn btn-outline-primary">Like this place? Add to plan!</button>`);

                }
            } else {
                recommendPicsDivMore.append(`<p>Sorry, please try again</p>`)
            }

            /*
                Like here button, for the page generated by more button.
            */
            $('.go-here').each(function () {
                $(this).on('click', function (event) {
                    event.preventDefault();

                    if ($(this).text() == 'Added to your plan') {
                        return alert('You have already added this place!');
                    }

                    // var thisPlaceData = {
                    //     name: $(this).prev().prev().prev().prev().prev().prev().prev().text(),
                    //     duration: $(this).prev().prev().prev().prev().prev().prev().text().split(': ')[1],
                    //     location: $(this).prev().prev().prev().text().replace('wv__', '').replaceAll('_', ' '),
                    //     coordinates: $(this).prev().prev().prev().prev().prev().children().text()
                    // }
                    var thisName = $(this).prev().prev().prev().prev().prev().prev().prev().text();

                    var requestSearchPlace = {
                        method: 'GET',
                        url: `/plan/getPlace/${thisName}`
                    }

                    $.ajax(requestSearchPlace).then(function (responseSearchPlace) {

                        let place = responseSearchPlace.candidates[0];
                        let name = place.name;
                        let latitude = place.geometry.location.lat;
                        let longitude = place.geometry.location.lng;
                        let splitedArray = place.plus_code.compound_code.split(',');
                        let location_id = splitedArray[splitedArray.length - 2].split(' ')[1];
                        let duration = (parseInt(6 * Math.random()) + 1) * 30;

                        var node = {
                            name: name,
                            location_id: location_id.trim(),
                            duration: duration,
                            coordinates: {
                                latitude: latitude,
                                longitude: longitude
                            }
                        }
                        var requestConfig = {
                            method: 'POST',
                            url: '/plan/addPlaceFromRecommend',
                            contentType: 'application/json',
                            data: JSON.stringify({
                                thisPlaceData: node,
                            })
                        };
                        $.ajax(requestConfig).then(function (responseMessage) {
                            dataToMakePlan = responseMessage;
                            console.log(dataToMakePlan);
                            // recommendPicsDivMore.html(responseMessage.message);
                        })
                    })
                    $(this).text('Added to your plan');
                })
            })

            /*
                This is about moreAround button, text is "See more around this place". 
                To generate a group of places which in the same location as their father.
                This CAN be invoke by the dynamic generated buttons!!!
            */
            $('.more-around').each(function () {
                $(this).on('click', function (event) {
                    event.preventDefault();
                    const location_id = $(this).prev().prev().text();
                    var requestConfig = {
                        method: 'GET',
                        url: `https://www.triposo.com/api/20201111/poi.json?location_id=${location_id}&account=T9TV2POT&token=2wve45tezxoq0kvv3dpd4odygaeb50rq`
                    };

                    $.ajax(requestConfig).then(function (responseMessage) {

                        var picData = $(responseMessage);
                        if (picData) {
                            recommendPicsDivOrigin.hide();
                            recommendPicsDivMore.empty();
                            recommendPicsDivMore.show();
                        }

                        var dataLists = queryLists(picData[0], 10);
                        var newDiv = []
                        if (dataLists) {

                            for (let i = 0; i < dataLists.length; i++) {
                                let targetPic = dataLists[i];

                                recommendPicsDivMore.append(`<div class="more-around-div"></div>`);

                                if (i == 0) {
                                    newDiv[i] = recommendPicsDivMore.children('div');
                                } else {
                                    newDiv[i] = newDiv[i - 1].next();
                                }

                                if (targetPic.url) {

                                    newDiv[i].append(`<img src=${targetPic.url.source_url} alt=${targetPic.name} width="384" height="216" class="image">`);
                                    newDiv[i].append(`<p>${targetPic.name}</p>`);
                                    newDiv[i].append(`<p>Duration: ${targetPic.duration} minutes</p>`);
                                    newDiv[i].append(`<ul>Coordinates: </ul>`);
                                    newDiv[i].find('ul').append(`<li>Latitude: ${targetPic.coordinates.latitude}</li>`);
                                    newDiv[i].find('ul').append(`<li>Latitude: ${targetPic.coordinates.longitude}</li>`);
                                    newDiv[i].append(`<span>Location: </span><p class="location-p">${targetPic.location_id}</p>`);
                                    newDiv[i].append(`<p>Description: ${targetPic.snippet}</p>`);
                                    newDiv[i].append(`<button class="go-here btn btn-outline-primary">Like this place? Add to plan!</button>`);

                                }
                            }
                        }
                        /*
                            Like here button, for the page generated by more-around button which belongs to page generated by more button.
                        */
                        $('.go-here').each(function () {
                            $(this).on('click', function (event) {
                                event.preventDefault();

                                if ($(this).text() == 'Added to your plan') {
                                    return alert('You have already added this place!');
                                }

                                // var thisPlaceData = {
                                //     name: $(this).prev().prev().prev().prev().prev().prev().text(),
                                //     duration: $(this).prev().prev().prev().prev().prev().text().split(': ')[1],
                                //     location: $(this).prev().prev().text().replace('wv__', '').replaceAll('_', ' '),
                                //     coordinates: $(this).prev().prev().prev().prev().children().text()
                                // }
                                var thisName = $(this).prev().prev().prev().prev().prev().prev().text();
                                var requestSearchPlace = {
                                    method: 'GET',
                                    url: `/plan/getPlace/${thisName}`
                                }

                                $.ajax(requestSearchPlace).then(function (responseSearchPlace) {

                                    let place = responseSearchPlace.candidates[0];
                                    let name = place.name;
                                    let latitude = place.geometry.location.lat;
                                    let longitude = place.geometry.location.lng;
                                    let splitedArray = place.plus_code.compound_code.split(',');
                                    let location_id = splitedArray[splitedArray.length - 2].split(' ')[1];
                                    let duration = (parseInt(6 * Math.random()) + 1) * 30;

                                    var node = {
                                        name: name,
                                        location_id: location_id.trim(),
                                        duration: duration,
                                        coordinates: {
                                            latitude: latitude,
                                            longitude: longitude
                                        }
                                    }
                                    var requestConfig = {
                                        method: 'POST',
                                        url: '/plan/addPlaceFromRecommend',
                                        contentType: 'application/json',
                                        data: JSON.stringify({
                                            thisPlaceData: node,
                                        })
                                    };
                                    $.ajax(requestConfig).then(function (responseMessage) {
                                        dataToMakePlan = responseMessage;
                                        console.log(dataToMakePlan);
                                        // recommendPicsDivMore.html(responseMessage.message);
                                    })
                                })
                                $(this).text('Added to your plan');
                            })
                        })
                    })

                    $('body,html').animate({ scrollTop: 0 }, 1000); // Back to top
                    moreButton.text("Not here");  //For better readbility, change the "More" button text on this page.
                })
            })
        })
        $('body,html').animate({ scrollTop: 0 }, 1000); // Back to top
        moreButton.text("More"); // In case the button text was "Not here" 
    })


    /*
        This is about moreAround button, text is "See more around this place". 
        To generate a group of places which in the same location as their father.
        This WONT work for the dynamic generated buttons, but the original buttons work.
    */
    $('.more-around').each(function () {
        $(this).on('click', function (event) {
            event.preventDefault();
            const location_id = $(this).prev().prev().text();
            var requestConfig = {
                method: 'GET',
                url: `https://www.triposo.com/api/20201111/poi.json?location_id=${location_id}&account=T9TV2POT&token=2wve45tezxoq0kvv3dpd4odygaeb50rq`
            };

            $.ajax(requestConfig).then(function (responseMessage) {

                var picData = $(responseMessage);
                if (picData) {
                    recommendPicsDivOrigin.hide();
                    recommendPicsDivMore.empty();
                    recommendPicsDivMore.show();
                }

                var dataLists = queryLists(picData[0], 10);
                var newDiv = []
                if (dataLists) {

                    for (let i = 0; i < dataLists.length; i++) {
                        let targetPic = dataLists[i];

                        recommendPicsDivMore.append(`<div class="more-around-div"></div>`);

                        if (i == 0) {
                            newDiv[i] = recommendPicsDivMore.children('div');
                        } else {
                            newDiv[i] = newDiv[i - 1].next();
                        }

                        if (targetPic.url) {

                            newDiv[i].append(`<img src=${targetPic.url.source_url} alt=${targetPic.name} width="384" height="216" class="image">`);
                            newDiv[i].append(`<p>${targetPic.name}</p>`);
                            newDiv[i].append(`<p>Duration: ${targetPic.duration} minutes</p>`);
                            newDiv[i].append(`<ul>Coordinates: </ul>`);
                            newDiv[i].find('ul').append(`<li>Latitude: ${targetPic.coordinates.latitude}</li>`);
                            newDiv[i].find('ul').append(`<li>Latitude: ${targetPic.coordinates.longitude}</li>`);
                            newDiv[i].append(`<span>Location: </span><p class="location-p">${targetPic.location_id}</p>`);
                            newDiv[i].append(`<p>Description: ${targetPic.snippet}</p>`);
                            newDiv[i].append(`<button class="go-here  btn btn-outline-primary">Like this place? Add to plan!</button>`);

                        }
                    }
                }
                /*
                    Like here button, for the page generated by more-around button which belongs to original page.
                */
                $('.go-here').each(function () {
                    $(this).on('click', function (event) {
                        event.preventDefault();

                        if ($(this).text() == 'Added to your plan') {
                            return alert('You have already added this place!');
                        }

                        // var thisPlaceData = {
                        //     name: $(this).prev().prev().prev().prev().prev().prev().text(),
                        //     duration: $(this).prev().prev().prev().prev().prev().text().split(': ')[1],
                        //     location: $(this).prev().prev().text().replace('wv__', '').replaceAll('_', ' '),
                        //     coordinates: $(this).prev().prev().prev().prev().children().text()
                        // }
                        var thisName = $(this).prev().prev().prev().prev().prev().prev().text();
                        var requestSearchPlace = {
                            method: 'GET',
                            url: `/plan/getPlace/${thisName}`
                        }

                        $.ajax(requestSearchPlace).then(function (responseSearchPlace) {

                            let place = responseSearchPlace.candidates[0];
                            let name = place.name;
                            let latitude = place.geometry.location.lat;
                            let longitude = place.geometry.location.lng;
                            let splitedArray = place.plus_code.compound_code.split(',');
                            let location_id = splitedArray[splitedArray.length - 2].split(' ')[1];
                            let duration = (parseInt(6 * Math.random()) + 1) * 30;

                            var node = {
                                name: name,
                                location_id: location_id.trim(),
                                duration: duration,
                                coordinates: {
                                    latitude: latitude,
                                    longitude: longitude
                                }
                            }
                            var requestConfig = {
                                method: 'POST',
                                url: '/plan/addPlaceFromRecommend',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    thisPlaceData: node,
                                })
                            };
                            $.ajax(requestConfig).then(function (responseMessage) {
                                dataToMakePlan = responseMessage;
                                console.log(dataToMakePlan);
                                // recommendPicsDivMore.html(responseMessage.message);
                            })
                        })
                        $(this).text('Added to your plan');
                    })
                })
            })
            $('body,html').animate({ scrollTop: 0 }, 1000); // Back to top
            moreButton.text("Not here");  //For better readbility, change the "More" button text on this page.
        })
    })


    /*
        Put the data into array with objects for easier to use.
    */
    function queryLists(data, imagePerPage) {

        let dataLists = [];
        let displayImagePerPage;
        if (imagePerPage) {

            displayImagePerPage = imagePerPage;

        } else {

            displayImagePerPage = 6;

        }

        if (data.results) {

            const maxTime = 6;
            const minTime = 1;

            for (let i = 0; i < displayImagePerPage; i++) {

                let estimateDutation = 30 * Math.round((maxTime - minTime + 1) * Math.random() + minTime);
                JSON.stringify(estimateDutation);

                dataLists[i] = {

                    name: data.results[i].name,
                    url: data.results[i].images[0],
                    location_id: data.results[i].location_id,
                    snippet: data.results[i].snippet,
                    coordinates: data.results[i].coordinates,
                    score: data.results[i].score,
                    booking_info: data.results[i].booking_info,
                    attribution: data.results[i].attribution,
                    price_tier: data.results[i].price_tier,
                    duration: estimateDutation

                }
            }
        }
        return dataLists
    }
})(window.jQuery);