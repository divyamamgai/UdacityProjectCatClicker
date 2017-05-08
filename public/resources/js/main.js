(function ($, w, d) {
    'use strict';
    /** @type JQuery */
    var $clickCount,
        $imageContainer,
        $image,
        $clickSounds,
        $restartButton,
        $loadingPercentage;
    var clickCount = 0;

    function xhrOnError() {
        alert('An error occurred while fetching a cure Cat image!\nRetrying...');
        initialize();
    }

    function xhrOnProgress(event) {
        if (event.lengthComputable) {
            $loadingPercentage.text(Math.round(event.loaded / event.total * 100) + '%');
        }
    }

    function initialize() {
        $restartButton.addClass('loading');
        $loadingPercentage.addClass('show');
        var xhr = new XMLHttpRequest();
        xhr.onprogress = xhrOnProgress;
        xhr.onerror = xhrOnError;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var url = window.URL || window.webkitURL;
                $image.css('background-image', 'url(' + url.createObjectURL(xhr.response) + ')');
                $clickCount.text(clickCount = 0);
                $restartButton.removeClass('loading');
                $loadingPercentage
                    .removeClass('show')
                    .text('0%');
            }
        };
        xhr.responseType = 'blob';
        xhr.open('GET', 'https://thecatapi.com/api/images/get?api_key=MTgyMTA2&format=src&category=dream');
        xhr.send();
    }

    function clickSoundPlay(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    function imageContainerOnMouseDown() {
        $imageContainer.addClass('clicked');
        $clickCount.addClass('image-clicked');
        $clickCount.text(++clickCount);
        clickSoundPlay($clickSounds.get(Math.floor(Math.random() * $clickSounds.length)));
    }

    function imageContainerOnMouseUp() {
        $imageContainer.removeClass('clicked');
        $clickCount.removeClass('image-clicked');
    }

    function restartButtonOnClick(event) {
        event.stopPropagation();
        if (!$restartButton.hasClass('loading')) {
            initialize();
        }
    }

    $(function () {
        $clickSounds = $('.click-sound', d);
        $clickSounds.each(function (index) {
            $clickSounds.get(index).volume = 0.2;
        });
        $imageContainer = $('#image-container', d)
            .on('mousedown', imageContainerOnMouseDown)
            .on('mouseup', imageContainerOnMouseUp);
        $image = $('#image', $imageContainer);
        $clickCount = $('#click-count', $imageContainer);
        $restartButton = $('#restart-button', $imageContainer)
            .on('click', restartButtonOnClick)
            .on('mousedown mouseup', function (event) {
                event.stopPropagation();
            });
        $loadingPercentage = $('#loading-percentage', $imageContainer);
        initialize();
    });
})(jQuery, window, document);
