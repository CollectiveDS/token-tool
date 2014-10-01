(function(window, document, undefined){
  var storageKey = 'oauth-creds';
  var save  = document.querySelector('#save');
  var form  = document.querySelector('form');
  var store = window.localStorage;
  var creds = JSON.parse(store.getItem(storageKey)) || {};

  var serialize = function(form){
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input[type="text"]'), 0);
    var serialized = [];
    inputs.forEach(function(input){
      serialized.push(input.name + '=' + input.value);
    });
    return serialized.join('&');
  };
  var unserialize = function(str){
    var out = {};
    var split = str.split('&');
    split.forEach(function(pair){
      var keyVal = pair.split('=');
      out[keyVal[0]] = keyVal[1];
    });
    return out;
  }

  var appendSavedCreds = function(creds){
    var saved = document.querySelector('#saved-creds');

    saved.innerHTML = "";

    for(var cred in creds){
      var listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.id = cred;
      listItem.textContent = cred;

      var removeButton = document.createElement('span');
      removeButton.className = 'glyphicon glyphicon-remove pull-right';

      listItem.appendChild(removeButton);
      saved.appendChild(listItem);
    }
  };

  appendSavedCreds(creds);

  document.querySelector('#saved-creds').addEventListener('click', function(e){
    var target = e.srcElement;

    if(target.className.indexOf('glyphicon-remove') !== -1){
      delete creds[target.parentNode.id];
      store.setItem(storageKey, JSON.stringify(creds));
      appendSavedCreds(creds);
    } else if(target.id){ // list item, load up the stored values
      var credentials = unserialize(creds[target.id]);
      for(var item in credentials){
        form[item].value = credentials[item];
      }
    }
  }, false);

  save.addEventListener('click', function(e){
    var credName = window.prompt("Enter a name for these credentials") || 'creds-'+Math.floor(Math.random()*100);

    creds[credName] = serialize(form);
    store.setItem(storageKey, JSON.stringify(creds));

    appendSavedCreds(creds);

    e.preventDefault();
    return false;
  });
})(window, document);
