var keystone = require('keystone');
var moment = require('moment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		posts: [],
		categories: [],
		dailyDevotions: [],
		sermons: [],
		category: {
			dailyDevotion: '',
			sermon: '',
		},
		aboutFbc: '',
		latestEvent: '',
	};

	// Load Daily Devotion category
	view.on('init', function(next) {
		var category = keystone.list('PostCategory').model.findOne({ key: 'daily-devotion' }).exec(function(err, result){
			locals.data.category.dailyDevotion = result;
			next(err);
		});
	});	

	// Load Sermon category
	view.on('init', function(next) {
		var category = keystone.list('PostCategory').model.findOne({ key: 'sermon' }).exec(function(err, result){
			locals.data.category.sermon = result;
			next(err);
		});
	});	

	// Load the Daily Devotion posts
	view.on('init', function(next) {

		var Post = keystone.list('Post');

		if(locals.data.category.dailyDevotion != ''){
			var q = Post.model.find()
				.where('categories').in([locals.data.category.dailyDevotion])
				.where('state', 'published')
				.populate('author categories')
				.sort('-publishedDate')
				.limit(5);

			q.exec(function(err, results) {
				locals.data.dailyDevotions = results;
				next(err);
			});
		}else{
			next();
		}
		
	});

	// Load the Sermon posts
	view.on('init', function(next) {

		var Post = keystone.list('Post');

		if(locals.data.category.sermon != ''){
			var q = Post.model.find()
				.where('categories').in([locals.data.category.sermon])
				.where('state', 'published')
				.populate('author categories')
				.sort('-publishedDate')
				.limit(5);

			q.exec(function(err, results) {
				locals.data.sermons = results;
				next(err);
			});
		}else{
			next();
		}
		
	});

	// Load the About FBC
	view.on('init', function(next) {

		var Post = keystone.list('Post');
		var q = Post.model.findOne({ slug: 'about-fbc'})
			.where('state', 'published')
			.populate('author categories');

		q.exec(function(err, results) {
			locals.data.aboutFbc = results;
			next(err);
		});
		
	});

	// Load the nearest Event
	view.on('init', function(next) {

		var Event = keystone.list('Event');
		var q = Event.model.find()
			.where('state', 'published')
			.sort('eventDate')
			.limit(1);

		q.exec(function(err, results) {
			locals.data.latestEvent = results[0];
			locals.data.latestEvent.eventDateFormatted = moment(locals.data.latestEvent.eventDate).format("DD/MM/YYYY");
			next(err);
		});
		
	});
	
	// Render the view
	view.render('index');
	
};
