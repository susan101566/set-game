var all_point = ['one', 'two', 'three'];
var all_color = ['red', 'green', 'purple'];
var all_fill = ['striped', 'empty', 'solid'];
var all_shape = ['circle', 'square', 'wave'];
var cur_deck = Array(81);

$(document).ready(function() {
  new_game();
  $('.card').on('click', cardListener);

  $('.submit').on('click', function(event) {
    event.preventDefault();
    var all_selected = $('.selected');
    if(all_selected.length != 3) {
      alert('Need to select three cards to form a set.');
      return;
    }
    var codesToCheck = Array(3);
    for(var i = 0; i < 3; i++) {
      var code = codeFromCard(all_selected[i]);
      codesToCheck[i] = code;
    }
    if(isSet(codesToCheck)) {
      clearAllSelected();
      removeCards(codesToCheck);
      dealThree();
    } else {
      alert('Not a set!');
      clearAllSelected();
    }
  });

  $('.hint').on('click', function(event) {
    event.preventDefault();
    var has = hasSet();
    if (has) {
      alert('Set: ' + has);
    } else {
      alert('No set');
      if(cur_deck.length < 3) {
        alert('YOU WIN!!');
      } else {
        appendNewCards(12, 15);
        $('.game').css('max-height', '910px');
      }
    }
  });
});

function cardListener(event) {
    event.preventDefault();
    var all_selected = $('.selected');
    var cur_id = this.id;

    // Get rid of the selected ones if there are three already.
    var contains = false;
    all_selected.each(function(x) {
      if(this.id == cur_id) {
          contains = true;
        }
    });
    if (all_selected.length == 3 && !contains) {
      clearAllSelected();
    }

    $(this).toggleClass('selected');
}

function clearAllSelected() {
  var all_selected = $('.selected');
  for(var i = 0; i < all_selected.length; i++) {
    $(all_selected[i]).toggleClass('selected');
  }
}
function removeCards(codes) {
  for(var i = 0; i < codes.length; i++) {
    $('#' + codes[i]).parent().empty();
  }
}

function dealThree() {
  var lenout = $('.card').length;
  var lenin = $('.inner').length;
  if(lenout > 12 && lenin < 12) {
    // no need to deal new cards.
    $('.game').css('max-height', '710px');
    var endsout = $('.card').splice(lenout - 3, 3);
    for(var i = 0; i < 12; i++) {
      if ($('#card_' + i)[0].innerHTML == '') {
        $('#card_' + i)[0].innerHTML = endsout.pop().innerHTML;
      }
    }
    return;
  }
  if(cur_deck.length == 0) {
    console.log('done dealing');
    return;
  }
  for(var i = 0; i < 12; i++) {
    if ($('#card_' + i)[0].innerHTML == '') {
      var newCard = createNewCard(cur_deck.pop(), 'card_' + i);
      $('#card_' + i)[0].innerHTML = newCard.innerHTML;
      if(cur_deck.length == 0) {
        $('#card_' + i).addClass('last-card');
        $('#card_' + i + ' .inner').addClass('last-card');
      }
    }
  }
  loadCss();
}

function codeFromCard(card) {
  if(card.children.length > 0) {
    return card.children[0].id;
  }
  return '4444';
}

function thirdCard(card1, card2) {
  var shouldbe = '';
  for(var i = 0; i < card1.length; i++) {
    if(card1[i] == card2[i]) {shouldbe += card1[i];}
    else {shouldbe += 3-card1[i]-card2[i];}
  }
  return shouldbe;
}

function hasSet() {
  var numCards = $('.card').length;
  var shownCards = $('.card');
  for(var i = 0; i < numCards; i++) {
    for(var j = i+1; j < numCards; j++) {
      var card1 = codeFromCard(shownCards[i]);
      var card2 = codeFromCard(shownCards[j]);
      var shouldbe = thirdCard(card1, card2);
      if($('#' + shouldbe).length > 0) {
        return [className(card1), className(card2), className(shouldbe)];
      }
    }
  }
  return false;
}

function isSet(codes) {
  return thirdCard(codes[0], codes[1]) == codes[2];
}

function loadCss() {
  for(var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        var class_name = '.' + all_color[i] + '.' + all_fill[j] + '.' + all_shape[k];
        var url = 'css/assets/' + all_color[i] + '-' + all_fill[j] + '-' + all_shape[k] + '.png';
        $(class_name).css('background-image', "url('" + url + "')");
        $(class_name + '.last-card').css('background-image', 'none');
      }
    }
  }
  $('.cards-left-num')[0].innerHTML = cur_deck.length;
};

function new_game() {
  var codeToIndex = shuffle_deck();
  var all_keys = Object.keys(codeToIndex);
  var numCards = all_keys.length;
  var shuffled_keys = Array(numCards);
  var in_play = 12;
  for (var i = 0; i < numCards; i++) {
    var code = all_keys[i];
    shuffled_keys[codeToIndex[code]] = code;
  }

  // form the new deck.
  for(var i = 0; i < numCards; i++) {
    // get the current code.
    var classString = 'inner ' + className(shuffled_keys[i]);
    cur_deck[i] = [classString, shuffled_keys[i]];
  }

  // display the cards in play.
  $('.game').empty();
  appendNewCards(0, in_play);
};

function appendNewCards(j, k) {
  // display the cards in play.
  var gameDom = $('.game');
  for(var i = j; i < k; i++) {
    var id = 'card_' + i;
    var newCard = createNewCard(cur_deck.pop(), id);
    gameDom.append(newCard);
  }
  loadCss();
}

function createNewCard(info, id) {
  var newCard = document.createElement('div');
  $(newCard).addClass('card');
  newCard.id = id;
  var newCardInner = document.createElement('div');
  $(newCardInner).addClass(info[0]);
  newCardInner.id = info[1];
  $(newCard).append(newCardInner);
  return newCard;
}

function className(code) {
  // point color fill shape
  var intCode = Math.floor(code/1);
  var ret = '';
  ret += all_point[Math.floor(intCode / 1000)];
  intCode = intCode % 1000;
  ret += ' ' + all_color[Math.floor(intCode / 100)];
  intCode = intCode % 100;
  ret += ' ' + all_fill[Math.floor(intCode / 10)];
  intCode = intCode % 10;
  ret += ' ' + all_shape[Math.floor(intCode)];
  return ret;
};

function shuffle_deck() {
  // return {0213: 5}
  var cards = {};
  // point, color, fill, shape
  var index = 0;
  while(index < 81) {
    var card = '';
    var rand = Math.floor(Math.random() * 81);
    var power = 3;
    while(power >= 0) {
      var denom = Math.pow(3, power);
      card += Math.floor(rand / denom);
      rand = rand % denom;
      power -= 1;
    }
    if(cards[card] === undefined) {
      cards[card] = index;
      index++;
    }
  }
  return cards;
};
