const frans = {name: 'Frans', text: '[Leerboek](http://v3dbot.github.io/v3d?url=frvlb)\n[Werkboek A](http://v3dbot.github.io/v3d?url=frvwba)\n[Werkboek B](http://v3dbot.github.io/v3d?url=frvwbb)'};
const scheikunde = {name: 'Scheikunde', text: '[Leerboek](http://v3dbot.github.io/v3d?url=skvlb)'};
const natuurkunde = {name: 'Natuurkunde', text: '[Leeropdrachtenboek](http://v3dbot.github.io/v3d?url=navg)'};
const engels = {name: 'Engels', text: '[Student\'s Book](http://v3dbot.github.io/v3d?url=envg)'};
const geschiedenis = {name: 'Geschiedenis', text: '[Leesboek](http://v3dbot.github.io/v3d?url=gsv3)'};

module.exports = {
  _help: 'Ik weet niet wat je bedoelt?\nIk ken Engels (en, eng)\nIk ken natuurkunde (na, nk, ns)\nIk ken scheikunde (sk, sc)\nIk ken geschiedenis (gs, ge)\nEn ik ken Frans (fr, fa)',
  frans,
  fa: frans,
  fr: frans,
  scheikunde,
  sc: scheikunde,
  sk: scheikunde,
  natuurkunde,
  na: natuurkunde,
  ns: natuurkunde,
  nk: natuurkunde,
  engels,
  en: engels,
  eng: engels,
  geschiedenis,
  ge: geschiedenis,
  gs: geschiedenis
};
