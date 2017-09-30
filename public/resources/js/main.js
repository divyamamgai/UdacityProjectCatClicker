(function ($, w, d, undefined) {
    'use strict';

    /** @type JQuery */
    var $clickSounds;

    /**
     * Cat Class
     * @param {Function} onClick
     * @constructor
     */
    var Cat = function (onClick) {
        /** @type JQuery */
        this.$imageContainer = Cat.$imageContainerCache
            .clone()
            .data('Cat', this)
            .on('click', Cat.imageContainerOnClick);

        /** @type JQuery */
        this.$image = $('.image', this.$imageContainer);

        /** @type JQuery */
        this.$resetButton = $('.reset-button', this.$imageContainer)
            .on('click', Cat.resetButtonOnClick)
            .on('mousedown mouseup', function (event) {
                event.stopPropagation();
            });

        /** @type JQuery */
        this.$clickCount = $('.click-count', this.$imageContainer);
        this.clickCount = 0;

        this.onClick = $.isFunction(onClick) ? onClick : $.noop;

        this.initialize();
    };

    /** @type JQuery */
    Cat.$imageContainerCache = $('<div class="image-container">\n    <div class="image-wrapper">\n        <div class="image"></div>\n    </div>\n    <div class="fa fa-repeat reset-button"></div>\n    <div class="click-count">0</div>\n</div>\n');

    Cat.imageContainerOnClick = function () {
        /** @type Cat */
        var cat = $(this).data('Cat');

        cat.$clickCount
            .addClass('image-clicked')
            .text(++cat.clickCount);

        cat.onClick();
    };

    /**
     * @param {Event} event
     */
    Cat.resetButtonOnClick = function (event) {
        /** @type Cat */
        var cat = $(this).parent().data('Cat');

        event.stopPropagation();

        if (!cat.$resetButton.hasClass('loading')) {
            cat.initialize();
        }
    };

    /**
     * @param {Function} onComplete
     * @param {Function} onError
     */
    Cat.getImage = function (onComplete, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onerror = onError;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var url = window.URL || window.webkitURL;
                onComplete(url.createObjectURL(xhr.response));
            }
        };
        xhr.responseType = 'blob';
        xhr.open('GET', 'https://thecatapi.com/api/images/get?api_key=MTgyMTA2&format=src&category=dream');
        xhr.send();
    };

    Cat.prototype.initialize = function () {
        /** @type Cat */
        var cat = this;

        cat.clickCount = 0;
        cat.$clickCount.text('0');
    };

    /**
     * Cat Thumbnail Class
     * @param {Cat} cat
     * @param {Function} [onInitialize]
     * @constructor
     */
    var CatThumbnail = function (cat, onInitialize) {
        this.imageURL = undefined;

        /** @type Cat */
        this.cat = cat;

        /** @type JQuery */
        this.$imageContainer = CatThumbnail.$thumbnailCache.clone()
            .data('CatThumbnail', this)
            .on('click', CatThumbnail.imageContainerOnClick);

        /** @type JQuery */
        this.$image = $('.image', this.$imageContainer);

        /** @type JQuery */
        this.$resetButton = $('.reset-button', this.$imageContainer)
            .on('click', CatThumbnail.resetButtonOnClick)
            .on('mousedown mouseup', function (event) {
                event.stopPropagation();
            });

        this.initialize(onInitialize);
    };

    CatThumbnail.imageContainerOnClick = function () {
        /** @type CatThumbnail */
        var catThumbnail = $(this).data('CatThumbnail');

        catThumbnail.cat.$image
            .css('background-image', 'url(' + catThumbnail.imageURL + ')');
    };

    CatThumbnail.resetButtonOnClick = function () {
        /** @type CatThumbnail */
        var catThumbnail = $(this).parent().data('CatThumbnail');

        event.stopPropagation();

        if (!catThumbnail.$resetButton.hasClass('loading')) {
            catThumbnail.initialize();
        }
    };

    /**
     * @param {Function} [onImageLoad]
     */
    CatThumbnail.prototype.initialize = function (onImageLoad) {

        /** @type CatThumbnail */
        var catThumbnail = this;

        /** @type JQuery */
        var $restartButton = catThumbnail.$resetButton.addClass('loading'),
            $image = catThumbnail.$image;

        Cat.getImage(function (imageURL) {
            catThumbnail.imageURL = imageURL;

            $image
                .css('background-image', 'url(' + imageURL + ')');

            $restartButton
                .removeClass('loading');

            if ($.isFunction(onImageLoad)) {
                onImageLoad(catThumbnail);
            }
        }, function () {
            alert('An error occurred while fetching a cure Cat image!\nRetrying...');
            catThumbnail.initialize();
        });
    };

    CatThumbnail.$thumbnailCache = $('<div class="thumbnail image-container">\n    <div class="image-wrapper">\n        <div class="image"></div>\n    </div>\n    <div class="fa fa-repeat reset-button"></div>\n</div>');

    function playClickSound() {
        var clickSound = $clickSounds.get(Math.floor(Math.random() * $clickSounds.length));
        clickSound.currentTime = 0;
        clickSound.play();
    }

    $(function () {
        $clickSounds = $('.click-sound', d);
        $clickSounds.each(function (index) {
            $clickSounds.get(index).volume = 0.2;
        });

        /** @type Cat */
        var cat = new Cat(playClickSound);

        /** @type CatThumbnail[] */
        var catThumbnails = [
            new CatThumbnail(cat, function (catThumbnail) {
                catThumbnail.$imageContainer.trigger('click');
            }),
            new CatThumbnail(cat),
            new CatThumbnail(cat),
            new CatThumbnail(cat),
            new CatThumbnail(cat)];

        /** @type JQuery */
        var $catThumbnailContainer = $('#cat-thumbnail-container', d);
        $catThumbnailContainer.append(catThumbnails.map(function (catThumbnail) {
            return catThumbnail.$imageContainer;
        }));

        /** @type JQuery */
        var $catContainer = $('#cat-container', d);

        $catContainer.append(cat.$imageContainer);
    });
})(jQuery, window, document);
