/*
---
description: Really, really simple carousel plugin that supports pages.
 
license: MIT-style

authors: [Jaap Broekhuizen <jaapz.b@gmail.com>]

version: 0.1

requires:
- core/1.4.5: '*'

provides: SimpleCarousel
...
*/

var SimpleCarousel = new Class(
{
	
	Implements: [Events, Options],
	
	options: 
	{
		id:	'carrousel', // Main wrapper for this carousel.
		itemsWrapper: 'listItems', // Wrapper for the carousel items.
		
		previousButton: 'butPrev', // Element that fires previous function.
		nextButton:	'butNext', // Element that fires next function.

		pageButtonWrapper: 'pageButtons', // ID of the element that holds the buttons.
		pageButtonClass: 'pageButton', // Class of all page buttons.
		pageButtonContainsNumber: false, // Whether the page button contains a page number.

		itemsPerPage: 3 // Number of items per page.
	},
	
	items: null,
	currentPage: 0,
	numPages: 0,
	pageWidth: 0,
	pageButtons: null,
	
	/**
	 * Initialize SimpleCarousel.
	 *
	 * @param {Object} options List of options.
	 * @public
	 * @constructs
	 */
	initialize: function(options)
	{
		this.setOptions(options);
		
		this.pageButtons = new Array();
		this.items = $(this.options.itemsWrapper).getChildren();

		// Only initialize when there are items in the carousel.
		if (this.items.length > 0) { 
			// Calculate the number of pages.
			this.numPages = Math.round((this.items.length / this.options.itemsPerPage));

			// Calculate the width of a page.
			var dimensions = this.items[0].getSize();
			this.pageWidth = dimensions.x * this.options.itemsPerPage;

			// Initialize the pagebuttons.
			if (this.numPages > 1) {
				this._createPageButtons();
			}

			// Connect events to the buttons.
			$(this.options.previousButton).addEvent('click', (this.previous).bind(this));
			$(this.options.nextButton).addEvent('click', (this.next).bind(this));

			// We are always starting on the first page, so hide the previous button.
			$(this.options.previousButton).fade('hide');

			if (this.numPages == 1) {
				$(this.options.nextButton).fade('hide');
			}

			// Set the right styles for the wrappers.
			var width = this.numPages * this.pageWidth;
			$(this.options.id).set('styles',{ 
				position: 'relative'
			});

			$(this.options.itemsWrapper).set('styles', { 
				position: 'absolute',
				left: 0, 
				top: 0,
				width: width
			});
		} else {
			// Don't show the next and previous buttons when there are no items.
			$(this.options.nextButton).fade('hide');
			$(this.options.previousButton).fade('hide');
		}

		this.fireEvent('initialize');
	},

	/**
	 * Go to a specific page. If the number is lower than the number of pages,
	 * the carousel will go to the first page, anf if the number is higher than
	 * the number of pages, it will go to the last page of the carousel.
	 * 
	 * @param {Integer} number Go to the page that has this number.
	 * @public
	 */
	goToPage: function(number)
	{
		// Catch some base cases.
		if (number < 1) {
			number = 1;
		} else if (number > this.numPages) {
			number = this.numPages;
		}

		// Make sure the buttons are shown at the right times.
		if (this.numPages > 1) {
			if (number == 1) {
				$(this.options.nextButton).fade('in');
				$(this.options.previousButton).fade('out');
			} else if (number == this.numPages) {
				$(this.options.nextButton).fade('out');
				$(this.options.previousButton).fade('in');
			} else {
				$(this.options.nextButton).fade('in');
				$(this.options.previousButton).fade('in');
			}
		}

		// Calculate the number of pixels that needs to be tweened.
		var tweenPixels = (number - 1) * this.pageWidth;

		// Actually go to the page by tweening the container div.
		$(this.options.itemsWrapper).tween('margin-left', -tweenPixels);

		// Give the active class to the right button.
		$$('.' + this.options.pageButtonClass + '.active').each(function(el) {
			el.removeClass('active');
		});
		$('page_button_' + number).addClass('active');

		this.currentPage = number;
		this.fireEvent('pagechange', number);
	},
	
	/**
	 * Go to the previous page.
	 *
	 * @public
	 */
	previous: function()
	{
		this.goToPage(this.currentPage - 1);
		this.fireEvent('previous');
	},

	/**
	 * Go to the next page.
	 *
	 * @public
	 */
	next: function()
	{
		this.goToPage(this.currentPage + 1);
		this.fireEvent('next');
	},

	/**
	 * Initialize the buttons for navigating to specific pages.
	 *
	 * @private
	 */
	_createPageButtons: function() {
		for (var i = 1; i <= this.numPages; i++) {
			var page = i;

			var pageButton = new Element('a', {
				'class': this.options.pageButtonClass,
				'id': 'page_button_' + i,
				'href': '#'
			});

			if (this.options.pageButtonContainsNumber) {
				pageButton.set('html', i);
			}

			// Add the goto page on click.
			pageButton.addEvent('click', (function(e) {
				e.preventDefault();
				this.goToPage(this.pageButtons.indexOf(e.target) + 1);

				$$('.' + this.options.pageButtonClass + '.active').each(function(el) {
					el.removeClass('active');
				});

				e.target.addClass('active');
			}).bind(this));

			$(this.options.pageButtonWrapper).grab(pageButton, 'bottom');
			this.pageButtons.push(pageButton);
		}

		if (this.pageButtons.length > 0) {
			this.pageButtons[0].addClass('active');
		}
	}
	
});
