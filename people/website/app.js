// use strict
'use strict';

// // event listner for go button
// function eventHandler(event){ // don't need
//   // event.preventDefault();
//   $('button').on('click', renderNames())
// }

// Get object json file object people / constructor function
// $ajax .then we need name.

$('#go').on('click', getPeople);

function getPeople() {
  $.ajax('http://localhost:3000/people', { method: 'get', datatype: 'json' })
    .then(names => {
      names.forEach(name => {
        renderNames(name);
      });
    });
}

// merge with the template #name template
function renderNames(name) {
  let $temp = $('#name-template').html();
  let $target = $('#people');
  let html = Mustache.render($temp, name);
  $target.append(html);
}

// render function for #people / prototyp and jQuery and Mustache.render