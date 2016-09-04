$.getScript("punycode.js");

var primary_ligatures_top_start = 0xf0000;
var primary_ligatures_bottom_start = 0xf0660;
var consonantal_ligatures_top_start = 0xf0f00;
var consonantal_ligatures_bottom_start = 0xf151c;
var primary_start = 0xe000;
var consonantal_start = 0xe127;
var top_start = 0xe18a;
var c_top_start = 0xe19b;
var bottom_start = 0xe1ac;
var ligatures_tb_start = 0xf209c;

function assemble_last(s) {
  cp = punycode.ucs2.decode(s);
  console.log(cp);
  // lc is last character
  // slc is second last character
  lc = cp[cp.length-1];
  if ((lc>=0xe18a&&lc<=0xe1cc)||(lc==0xe253||lc==0xe254)) { // Last character is an extension? Or a bias diacritic that we know always follows an extension?
    slc = cp[cp.length-2];
    if (slc==0xe185&&lc>=0x19b&&lc<=0xe1ab) { // Laterally reversed placeholder?
      // Simple replacement with laterally reversed version
      return s.substring(0,s.length-2) + String.fromCodePoint(lc+186);
    }
    if (slc==0xe184||slc==0xe186) { // Placeholder?
      // Simple removal of placeholder character
      return s.substring(0,s.length-2) + s.charAt(s.length-1);
    }
    else if (lc==0xe253||lc==0xe254) { // Bias with diacritic?
      // Bias diacritic characters are input together with the corresponding extension. Therefore, end of string without the diacritic should be replaced if necessary, and then the diacritic added back.
      var bias_diacritic = String.fromCodePoint(lc);
      return assemble_last(s.substring(0,s.length-1)) + bias_diacritic;
    }
    else if ((slc>=0xe000&&slc<=0xe05f)&&(lc>=0xe18a&&lc<=0xe19a)) { // Primary with top?
      return s.substring(0,s.length-2) + String.fromCodePoint((lc-top_start)*96+(slc-primary_start)+primary_ligatures_top_start);
    }
    else if ((slc>=0xe000&&slc<=0xe05f)&&(lc>=0xe1ac&&lc<=0xe1c2)) { // Primary with bottom?
      return s.substring(0,s.length-2) + String.fromCodePoint((lc-bottom_start)*96+(slc-primary_start)+primary_ligatures_bottom_start);
    }
    else if ((slc>=0xe127&&slc<=0xe182)&&(lc>=0xe19b&&lc<=0xe1ab)) { // Consonantal with top?
      return s.substring(0,s.length-2) + String.fromCodePoint((lc-top_start)*96+(slc-primary_start)+primary_ligatures_top_start);
    }
    else if ((slc>=0xe127&&slc<=0xe182)&&(lc>=0xe1ac&&lc<=0xe1cc)) { // Consonantal with bottom?
      return s.substring(0,s.length-2) + String.fromCodePoint((lc-bottom_start)*92+(slc-consonantal_start)+consonantal_ligatures_bottom_start);
    }
    else if ((slc>=0xf0000&&slc<=0xf065f)&&(lc>=0xe1ac&&lc<=0xe1cc)) { // Primary with top + bottom?
      var new_cp = cp.slice(0,cp.length-2);
      new_cp.push((lc-bottom_start)*96*17+(slc-primary_ligatures_top_start)+ligatures_tb_start);
      return punycode.ucs2.encode(new_cp);
    }
    // else if ((slc>=0xf0660&&slc<=0xf0eff)&&(lc>=0xe18a&&lc<=0xe19a)) { // Primary with bottom + top? — REQUIRES MORE MAGIC
    //   var new_cp = cp.slice(0,cp.length-2);
    //   new_cp.push((lc-bottom_start)*96*17+(slc-primary_ligatures_top_start)+ligatures_tb_start);
    //   return punycode.ucs2.encode(new_cp);
    // }
  }
  return s; 
}