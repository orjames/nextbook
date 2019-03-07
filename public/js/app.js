var selector


document.addEventListener('DOMContentLoaded', function() {
selector = document.getElementById('inputGroupSelect01')
var inputDiv = document.getElementById('inputDiv');
inputDiv.style.display = 'none';
document.getElementById('inputBox').value = '';
selector.addEventListener('change', showInputField)
});

function showInputField() {
  if (selector.value === 'name') {
    document.getElementById('inputBox').placeholder = 'Book Title...';
  } else if (selector.value === 'author') {
    document.getElementById('inputBox').placeholder = 'Author...';
  } else if (selector.value === 'category') {
    document.getElementById('inputBox').placeholder = 'Genre/Category...';
  } else {
    console.log('error')
  }
  document.getElementById('inputBox').name = selector.value;
  console.log('in show input Field function');
  console.log('selector value is ' + selector.value);
  var inputDiv = document.getElementById('inputDiv');
  var selected = document.getElementById(`inputDiv`).style.display = '';
}

