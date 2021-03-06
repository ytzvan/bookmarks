/**
 * RequestController
 *
 * @description :: Server-side logic for managing requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
var cheerio = require('cheerio');
var urls = require('machinepack-urls');

module.exports = {

	add : function(req, res) {
		var url = req.param('url');
		var a = urls.parse({
			url: url,
			}).execSync();
		var linkType = 'article';
		request(url, function (error, response, html) {
		  if (!error && response.statusCode == 200) {
		    var $ = cheerio.load(html);
		    var title = $('meta[property="og:title"]').attr('content');
		    if (!title) {
		    	title = $("title").text();
		    }
		    var image = $('meta[property="og:image"]').attr('content');
		    var content = $('meta[property="og:description"]').attr('content');
		    if (!content) {
		    	content = $("title").text() + " | " + a.hostname;
		    }
		    var site = $('meta[property="og:site_name"]').attr('content');
		    if (!site) {
		    	site = a.hostname;
		    }
		    var link = url;
		    console.log(a.hostname);
		    if (a.hostname === 'www.youtube.com') {
		    	 linkType = 'video';
		    }
		    var result = {};
		    result = {title : title,
		    		  image : image,
		    		  content : content,
		    					site: site,
		    					link : link,
		    					linkType: linkType};
		    Request.create(result)
		    .exec(function (err, data){
		      if (err) return cb(err);
		      return res.redirect("/");
		    })

		  } else {
		  	res.send("error - different from 200");
		  }
		  
		});
	},

	home : function (req, res) {
    Request.find({archived:false})
   // Request.find()
    .exec(function(err, links) {
       return  res.view('home',{
          l: links
        });
    });
  },

  archive : function (req, res) {
  	/*console.log(req.params('id'));
  	var id = req.params('id');
  	Request.update({id: id},{archived:true})
  	.exec(function (err, data){
		      if (err) return cb(err);
		      return res.json(data);
		    });*/
	var id= req.param('id');
	Request.update({id:id},{archived:true}).exec(function afterwards(err, updated){

	  if (err) {
	    // handle error here- e.g. `res.serverError(err);`
	    return res.serverError(err);
	  }

		  res.redirect('/');
		});
	},

	listArchived : function (req, res) {
    Request.find({archived:true})
    .exec(function(err, links) {
       return  res.view('homepage',{
          l: links
        });
    });
  },
	
};

