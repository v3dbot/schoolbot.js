const frans = {name: 'Frans', text: '[hele week](http://meet.google.com/*)'};
const scheikunde = {name: 'Scheikunde/Mentoruur', text: '[hele week](https://meet.google.com/*)'};
const natuurkunde = {name: 'Natuurkunde', text: '[ma 2e lesuur](https://meet.google.com/*)\n[di 6e lesuur](https://meet.google.com/*)\n[vr 1e lesuur](https://meet.google.com/*)'};
const engels = {name: 'Engels', text: '[hele week](http://meet.google.com/*)'};
const noLink = {name: "Geen link gevonden", text: 'Hiervoor is geen vaste link'};
const duits = {name: 'Duits', text: '[hele week](https://meet.google.com/lookup/*)'};
const wiskunde = {name: "Wiskunde", text: '[maandag](https://meet.google.com/*) [dinsdag](https://meet.google.com/*) [woensdag](https://meet.google.com/*) [donderdag](https://meet.google.com/*) [vrijdag](https://meet.google.com/*)'};
const nederlands = {name: 'Nederlands', text: '[hele week](https://meet.google.com/*)'};
const economie = {name: 'Economie', text: '[hele week](https://meet.google.com/*)'};
const lijfstijl = {name: 'Lijfstijl', text: '[hele week](https://meet.google.com/lookup/*)'};

module.exports = {
  _help: 'Ik weet niet wat je bedoelt?\nIk ken Engels (en, eng)\nIk ken natuurkunde (na, nk, ns)\nIk ken scheikunde (sk, sc, men, mentorles, mentoruur, mentor)\nIk ken geschiedenis (gs, ge)\nIk ken aardrijkskunde (ak, geo)\nIk ken Nederlands (nl, ne, ned)\nIk ken wiskunde (wis, wi)\nIk ken economie (ec, eco, mo, m&o)\nEn ik ken Frans (fr, fa)',
  frans,
  fa: frans,
  fr: frans,
  scheikunde,
  sk: scheikunde,
  sc: scheikunde,
  mentor: scheikunde,
  men: scheikunde,
  mentoruur: scheikunde,
  mentorles: scheikunde,
  natuurkunde,
  nk: natuurkunde,
  na: natuurkunde,
  ns: natuurkunde,
  engels,
  en: engels,
  eng: engels,
  geschiedenis: noLink,
  ge: noLink,
  gs: noLink,
  aardrijkskunde: noLink,
  ak: noLink,
  gs: noLink,
  duits,
  du: duits,
  de: duits,
  wiskunde,
  wis: wiskunde,
  wi: wiskunde,
  nederlands,
  ne: nederlands,
  nl: nederlands,
  economie,
  eco: economie,
  ec: economie,
  mo: economie,
  'm&o': economie,
  lijfstijl,
  lifestyle: lijfstijl,
  ls: lijfstijl
};
