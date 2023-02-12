
function res_size() {
  
  const nav = $('nav.navbar').height();
  $('main, .header').css('padding-top', nav + 60);
  return
  
}
res_size();

$( window ).resize(function() {
  res_size();
});
$('.navbar-toggler').on('click', function (e) { 
  $('header.header').toggleClass('open');
  $('body').toggleClass('open');
});
