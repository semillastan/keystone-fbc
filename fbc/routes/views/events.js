var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.section = 'events';
	locals.filters = {
		
	};
	locals.data = {
		events: [],
	};
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Event').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('eventDate')
			.populate('author categories');
		
		q.exec(function(err, results) {
			locals.data.events = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('events');
	
};
