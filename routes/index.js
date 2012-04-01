
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('layout', { title: 'Express' });
};

//exports['/:page'] = function(req, res){
//  res.render(req.params.page, {});
//}