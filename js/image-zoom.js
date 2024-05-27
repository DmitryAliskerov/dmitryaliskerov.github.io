/* =============================================================================
Image Zoom JS v0.0.1 | MIT License | https://github.com/alecrios/image-zoom-js
============================================================================= */

'use strict';

var timestamp = Date.now();
var lastMouseX = 0;
var lastMouseY = 0;
var maxMouseSpeed = 0;

document.body.addEventListener("mousemove", function(e) {
    var now = Date.now();
    var dt =  now - timestamp;
    var dx = e.screenX - lastMouseX;
    var dy = e.screenY - lastMouseY;
    var speedX = dx / dt * 100;
    var speedY = dy / dt * 100;

    maxMouseSpeed = Math.max(speedX, speedY);

    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
});

class imageZoom {
	constructor(image) {
		// Image
		this.image = image;

		// Backdrop
		this.backdrop = document.querySelector('[data-zoom-backdrop]');
		this.img = document.createElement('img')
		this.img.classList.add("full-image");

		if (this.backdrop === null) {
			this.backdrop = document.createElement('div');
			this.backdrop.setAttribute('data-zoom-backdrop', '');
                        this.backdrop.appendChild(this.img);
			document.body.appendChild(this.backdrop);
		}

		// Pass `this` through to methods
		this.zoomImage = this.zoomImage.bind(this);
		this.resetImage = this.resetImage.bind(this);

		// Add click event handler
		this.image.addEventListener('mouseup', this.zoomImage);
	}

	zoomImage() {

		if (Math.abs(maxMouseSpeed) > 2) {
			maxMouseSpeed = 0;
			return;
		}

		// Prevent an image from zooming while another is already active
		if (this.backdrop.getAttribute('data-zoom-active') === 'true') return;

		// Declare zoom function to be active
		this.backdrop.setAttribute('data-zoom-active', 'true');

		// Handle event listeners
		this.image.removeEventListener('mouseup', this.zoomImage);
		this.image.addEventListener('mouseup', this.resetImage);
		this.backdrop.addEventListener('mouseup', this.resetImage);
		document.addEventListener('keyup', this.resetImage);
		window.addEventListener('scroll', this.resetImage);
		window.addEventListener('resize', this.resetImage);

		// Fade in backdrop
		this.backdrop.setAttribute('data-zoom-backdrop', 'active');

		// Set image style
		this.image.setAttribute('data-zoom-image', 'active');

		this.backdrop.firstChild.setAttribute('src', this.image.getAttribute('src'));

		// Set image transform

		this.imageBCR = this.image.getBoundingClientRect();
	}

	resetImage() {
		// Handle event listeners
		window.removeEventListener('resize', this.resetImage);
		window.removeEventListener('scroll', this.resetImage);
		document.removeEventListener('keyup', this.resetImage);
		this.backdrop.removeEventListener('mouseup', this.resetImage);
		this.image.removeEventListener('mouseup', this.resetImage);
		this.image.addEventListener('mouseup', this.zoomImage);

		// Fade out backdrop
		this.backdrop.setAttribute('data-zoom-backdrop', '');

		this.backdrop.setAttribute('data-zoom-active', 'false');
		this.image.setAttribute('data-zoom-image', '');


		// Reset image transform
		this.image.style.transform = null;
	}
}

// Create a new instance for each image
document.querySelectorAll('[data-zoom-image]').forEach(function(img) {
	new imageZoom(img);
});
