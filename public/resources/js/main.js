(function ($, w, d) {
    'use strict';

    /** @type JQuery */
    var $clickSounds;

    /**
     * Cat Class
     * @param {Function} onMouseDown
     * @constructor
     */
    var Cat = function (onMouseDown) {
        /** @type JQuery */
        this.$imageContainer = Cat.$imageContainerCache
            .clone()
            .data('Cat', this)
            .on('mousedown', this.imageContainerOnMouseDown)
            .on('mouseup', this.imageContainerOnMouseUp);
        /** @type JQuery */
        this.$image = $('.image', this.$imageContainer);
        /** @type JQuery */
        this.$restartButton = $('.restart-button', this.$imageContainer)
            .on('click', this.restartButtonOnClick)
            .on('mousedown mouseup', function (event) {
                event.stopPropagation();
            });
        /** @type JQuery */
        this.$loadingPercentage = $('.loading-percentage', this.$imageContainer);
        /** @type JQuery */
        this.$clickCount = $('.click-count', this.$imageContainer);
        this.clickCount = 0;
        this.onMouseDown = $.isFunction(onMouseDown) ? onMouseDown : $.noop;
        this.initialize();
    };

    Cat.prototype.imageContainerOnMouseDown = function () {
        var self = $(this).data('Cat');
        self.$imageContainer
            .addClass('clicked');
        self.$clickCount
            .addClass('image-clicked')
            .text(++self.clickCount);
        self.onMouseDown();
    };

    Cat.prototype.imageContainerOnMouseUp = function () {
        var self = $(this).data('Cat');
        self.$imageContainer
            .removeClass('clicked');
        self.$clickCount
            .removeClass('image-clicked');
    };

    /**
     * @param {Event} event
     */
    Cat.prototype.restartButtonOnClick = function (event) {
        var self = $(this).parent().data('Cat');
        event.stopPropagation();
        if (!self.$restartButton.hasClass('loading')) {
            self.initialize();
        }
    };

    Cat.prototype.$getImageContainer = function () {
        return this.$imageContainer;
    };

    Cat.prototype.initialize = function () {

        /** @type Cat */
        var self = this;

        /** @type JQuery */
        var $restartButton = self.$restartButton.addClass('loading'),
            $loadingPercentage = self.$loadingPercentage.addClass('show'),
            $image = self.$image,
            $clickCount = self.$clickCount;
        self.clickCount = 0;

        var xhr = new XMLHttpRequest();
        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                $loadingPercentage.text(Math.round(event.loaded / event.total * 100) + '%');
            }
        };
        xhr.onerror = function () {
            alert('An error occurred while fetching a cure Cat image!\nRetrying...');
            self.initialize();
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var url = window.URL || window.webkitURL;
                $image
                    .css('background-image', 'url(' + url.createObjectURL(xhr.response) + ')');
                $clickCount
                    .text('0');
                $restartButton
                    .removeClass('loading');
                $loadingPercentage
                    .removeClass('show')
                    .text('0%');
            }
        };
        xhr.responseType = 'blob';
        xhr.open('GET', 'https://thecatapi.com/api/images/get?api_key=MTgyMTA2&format=src&category=dream');
        xhr.send();
    };

    /** @type JQuery */
    Cat.$imageContainerCache = $('<div class="image-container">\n    <div class="image-wrapper">\n        <div class="image"></div>\n    </div>\n    <div class="fa fa-repeat restart-button">\n        <div class="loading-percentage">0%</div>\n    </div>\n    <div class="click-count">0</div>\n</div>\n');

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
        /** @type Cat[] */
        var cats = [new Cat(playClickSound), new Cat(playClickSound), new Cat(playClickSound)];
        /** @type JQuery */
        var $catContainer = $('#cat-container', d);
        $catContainer.append(cats.map(function (cat) {
            return cat.$getImageContainer();
        }));
    });
})(jQuery, window, document);
