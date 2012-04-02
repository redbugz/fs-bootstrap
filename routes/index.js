
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('hero', { title: 'Express' });
};

//exports['/:page'] = function(req, res){
//  res.render(req.params.page, {});
//}