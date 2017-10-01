(function ($, w, d, undefined) {
    'use strict';

    /** @type JQuery */
    var $clickSounds;

    /**
     * Cat Thumbnail Class
     * @param {CatClicker} catClicker
     * @param {Function} [onInitialize]
     * @constructor
     */
    var Cat = function (catClicker, onInitialize) {
        this.imageURL = undefined;
        this.clickCount = 0;

        /** @type CatClicker */
        this.catClicker = catClicker;

        /** @type JQuery */
        this.$imageContainer = Cat.$thumbnailCache.clone()
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

        this.initialize(onInitialize);
    };

    /** @type JQuery */
    Cat.$thumbnailCache = $('<div class="thumbnail image-container">\n    <div class="image-wrapper">\n        <div class="image"></div>\n    </div>\n    <div class="fa fa-repeat reset-button"></div>\n</div>');

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

    Cat.imageContainerOnClick = function () {
        /** @type Cat */
        var cat = $(this).data('Cat');

        cat.catClicker.setCat(cat);
    };

    Cat.resetButtonOnClick = function () {
        /** @type Cat */
        var cat = $(this).parent().data('Cat');

        event.stopPropagation();

        if (!cat.$resetButton.hasClass('loading')) {
            cat.initialize();
        }
    };

    /**
     * @param {Function} [onImageLoad]
     */
    Cat.prototype.initialize = function (onImageLoad) {

        /** @type Cat */
        var cat = this;

        cat.imageURL = undefined;
        cat.clickCount = 0;

        /** @type JQuery */
        var $restartButton = cat.$resetButton.addClass('loading'),
            $image = cat.$image;

        Cat.getImage(function (imageURL) {
            cat.imageURL = imageURL;

            $image
                .css('background-image', 'url(' + imageURL + ')');

            $restartButton
                .removeClass('loading');

            if ($.isFunction(onImageLoad)) {
                onImageLoad(cat);
            }
        }, function () {
            alert('An error occurred while fetching a cure Cat image!\nRetrying...');
            cat.initialize(onImageLoad);
        });
    };

    /**
     * CatClicker Class
     * @param {Function} onClick
     * @constructor
     */
    var CatClicker = function (onClick) {
        /** @type JQuery */
        this.$imageContainer = CatClicker.$imageContainerCache
            .clone()
            .data('CatClicker', this)
            .on('click', CatClicker.imageContainerOnClick);

        /** @type JQuery */
        this.$image = $('.image', this.$imageContainer);

        /** @type JQuery */
        this.$resetButton = $('.reset-button', this.$imageContainer)
            .on('click', CatClicker.resetButtonOnClick)
            .on('mousedown mouseup', function (event) {
                event.stopPropagation();
            });

        /** @type JQuery */
        this.$clickCount = $('.click-count', this.$imageContainer);

        this.onClick = $.isFunction(onClick) ? onClick : $.noop;

        /** @type Cat */
        this.cat = undefined;
    };

    /** @type JQuery */
    CatClicker.$imageContainerCache = $('<div class="image-container">\n    <div class="image-wrapper">\n        <div class="image"></div>\n    </div>\n    <div class="fa fa-repeat reset-button"></div>\n    <div class="click-count">0</div>\n</div>\n');

    CatClicker.imageContainerOnClick = function () {
        /** @type CatClicker */
        var catClicker = $(this).data('CatClicker');

        catClicker.cat.clickCount++;
        catClicker.render();

        catClicker.onClick();
    };

    /**
     * @param {Event} event
     */
    CatClicker.resetButtonOnClick = function (event) {
        /** @type CatClicker */
        var catClicker = $(this).parent().data('CatClicker');

        event.stopPropagation();

        catClicker.cat.clickCount = 0;
        catClicker.render();
    };

    /**
     * @param {Cat} cat
     */
    CatClicker.prototype.setCat = function (cat) {
        /** @type CatClicker */
        var catClicker = this;

        catClicker.cat = cat;
        catClicker.render();
    };

    CatClicker.prototype.render = function () {
        /** @type CatClicker */
        var catClicker = this;

        catClicker.$clickCount
            .text(catClicker.cat.clickCount);
        catClicker.$image
            .css('background-image', 'url(' + catClicker.cat.imageURL + ')');
    };

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

        /** @type CatClicker */
        var catClicker = new CatClicker(playClickSound);

        /** @type Cat[] */
        var cats = [
            new Cat(catClicker, function (catThumbnail) {
                catThumbnail.$imageContainer.trigger('click');
            }),
            new Cat(catClicker),
            new Cat(catClicker),
            new Cat(catClicker),
            new Cat(catClicker)];

        /** @type JQuery */
        var $catThumbnailContainer = $('#cat-thumbnail-container', d);
        $catThumbnailContainer.append(cats.map(function (catThumbnail) {
            return catThumbnail.$imageContainer;
        }));

        /** @type JQuery */
        var $catContainer = $('#cat-container', d);

        $catContainer.append(catClicker.$imageContainer);
    });
})(jQuery, window, document);
