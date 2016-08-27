var primary_ligatures_top_start = 0xf0000;
var primary_ligatures_bottom_start = 0xf0660;
var consonantal_ligatures_top_start = 0xf0f00;
var consonantal_ligatures_bottom_start = 0xf151c;
var primary_start = 0xe000;
var consonantal_start = 0xe127;
var top_start = 0xe18a;
var c_top_start = 0xe19b;
var bottom_start = 0xe1ac;

function produce(c,t,b) {
  // Top only
  if (b==0) {
    // Primary
    if (c>=0xe000&&c<=0xe05f) {
      return String.fromCodePoint((t-top_start)*96+(c-primary_start)+primary_ligatures_top_start);
    }
    // Consonantal
    else if (c>=0xe127&&c<=0xe182) {
      return String.fromCodePoint((t-c_top_start)*92+(c-consonantal_start)+consonantal_ligatures_top_start);
    }
  }
  // Bottom only
  else if (t==0) {
    // Primary
    if (c>=0xe000&&c<=0xe05f) {
      return String.fromCodePoint((b-bottom_start)*96+(c-primary_start)+primary_ligatures_bottom_start);
    }
    // Consonantal
    else if (c>=0xe127&&c<=0xe182) {
      return String.fromCodePoint((b-bottom_start)*92+(c-consonantal_start)+consonantal_ligatures_bottom_start);
    }
  }
  // Both
  else {
    return String.fromCodePoint(c,t,b);
  }
}

function assemble_last(s) {
  lc = s.charCodeAt(s.length-1)
  console.log(lc);
  if ((lc>=0xe18a&&lc<=0xe1cc)||(lc==0xe253||lc==0xe254)) { // Last character is an extension? Or a bias diacritic that we know always follows an extension?
    c1 = s.charCodeAt(s.length-2)
    if (c1==0xe185&&lc>=0x19b&&lc<=0xe1ab) { // Laterally reversed placeholder?
      // Simple replacement with laterally reversed version
      return s.substring(0,s.length-2) + String.fromCodePoint(lc+186);
    }
    if (c1==0xe184||c1==0xe186) { // Placeholder?
      // Simple removal of placeholder character
      return s.substring(0,s.length-2) + s.charAt(s.length-1);
    }
    else if (lc==0xe253||lc==0xe254) { // Bias with diacritic?
      // Bias diacritic characters are input together with the corresponding extension. Therefore, end of string without the diacritic should be replaced if necessary, and then the diacritic added back.
      var bias_diacritic = String.fromCodePoint(lc);
      return assemble_last(s.substring(0,s.length-1)) + bias_diacritic;
    }
    else if ((c1>=0xe000&&c1<=0xe05f)&&(lc>=0xe18a&&lc<=0xe19a)) { // Primary with top?
      return s.substring(0,s.length-2) + produce(c1,lc,0);
    }
    else if ((c1>=0xe000&&c1<=0xe05f)&&(lc>=0xe1ac&&lc<=0xe1c2)) { // Primary with bottom?
      return s.substring(0,s.length-2) + produce(c1,0,lc);
    }
    else if ((c1>=0xe127&&c1<=0xe182)&&(lc>=0xe19b&&lc<=0xe1ab)) { // Consonantal with top?
      return s.substring(0,s.length-2) + produce(c1,lc,0);
    }
    else if ((c1>=0xe127&&c1<=0xe182)&&(lc>=0xe1ac&&lc<=0xe1cc)) { // Consonantal with bottom?
      return s.substring(0,s.length-2) + produce(c1,0,lc);
    }
  }
  return s; 
}