SimpleCarousel
==============

This is a very simple implementation of a carousel. It supports multiple items on one page

How to use
----------

More documentation will follow, but for now I'll just give you a list of available options to keep you happy.

    new SimpleCarousel({ 
		id:	'carrousel', // Main wrapper for this carousel.
		itemsWrapper: 'listItems', // Wrapper for the carousel items.
		
		previousButton: 'butPrev', // Element that fires previous function.
		nextButton:	'butNext', // Element that fires next function.

		pageButtonWrapper: 'pageButtons', // ID of the element that holds the buttons.
		pageButtonClass: 'pageButton', // Class of all page buttons.
		pageButtonContainsNumber: false, // Whether the page button contains a page number.

		itemsPerPage: 3 // Number of items per page.
    });

License
-------

This plugin is released under the terms of the MIT-style license.

Notes
-----

This plugin is still a WIP, so it can still be a little bit buggy!