var input_codes = {};
// Turn codes array into characters, add placeholder if required
function inputise(ph, a) {
  return $.map(a, function(i, j) {
    return (ph==0 ? '' : String.fromCharCode(ph)) + (i==0 ? '' : String.fromCharCode(i));
  });
}

var case_names = [
  "OBL", "IND", "ABS", "ERG", "EFF", "AFF",
  "DAT", "INS", "ACT", "DER", "SIT", "POS",
  "PRP", "GEN", "ATT", "PDC", "ITP", "OGN",
  "PAR", "CRS", "CPS", "PRD", "MED", "APL",
  "PUR", "CSD", "ESS", "ASI", "FUN", "TFM",
  "REF", "CLA", "CNV", "IDP", "BEN", "TSP",
  "CMM", "COM", "CNJ", "UTL", "ABE", "CVS",
  "COR", "DER", "PVS", "PTL", "CON", "VOC",
  "EXC", "AVR", "CMP", "SML", "ASS", "CNR",
  "ACS", "DFF", "PER", "PRO", "PCV", "PCR",
  "ELP", "ALP", "INP", "EPS", "PRL", "LIM",
  "LOC", "ORI", "PSV", "ALL", "ABL", "NAV"];
for (var i = 0; i < 3; i++) {
  $.merge(case_names,
    ["CMPA", "CMPB", "CMPC", "CMPD", "CMPE", "CMPF", "CMPG", "CMPH"]);
};
$.each(case_names, function(i,j) {
  if (!$.isArray(input_codes[j])) {input_codes[j] = [];};
  input_codes[j].push(String.fromCharCode(i+0xe000)); // Primary characters
  input_codes[j].push(String.fromCharCode(i+0xe060)); // Secondary characters
  input_codes[j].push(String.fromCharCode(i+0xe0c0)); // Reversed secondary characters
});
var aspect_names = [
  'RTR','PRS','HAB','PRG','IMM','PCS','REG','EXP','RSM','CSS','RCS','PAU',
  'RGR','PCL','CNT','ICS','PMP','CLM','PTC','TMP','MTV','CSQ','SQN','EPD',
  'DSC','CCL','CUL','IMD','TRD','TNC','ITC','CSM'];
$.each(aspect_names, function(i,j) {
  if (!$.isArray(input_codes[j])) {input_codes[j] = [];};
  input_codes[j].push(String.fromCharCode(i+0xe000)); // Primary characters
  input_codes[j].push(String.fromCharCode(0xe060) + String.fromCharCode(i+0xe1f3)); // Secondary characters
  input_codes[j].push(String.fromCharCode(0xe0c0) + String.fromCharCode(i+0xe213)); // Reversed secondary characters
});
var modality_names = [
  'DES','ASP','EXV','CRD','REQ','EXH','OPR','CPC','PRM','PTN','CLS','OBG',
  'IMS','ADV','ITV','ANT','DSP','PRE','NEC','DEC','PTV','VOL','ACC','INC',
  'CML','DVR','DVT','PFT','IPS','PMS'];
$.each(modality_names, function(i,j) {
  if (!$.isArray(input_codes[j])) {input_codes[j] = [];};
  input_codes[j].push(String.fromCharCode(i+0xe020)); // Primary characters
  input_codes[j].push(String.fromCharCode(0xe060) + String.fromCharCode(i+0xe233)); // Secondary characters
});
var valence_names = [
  'MNO','PRL','CRO','RCP','CPL','NNR','DUP','DEM','RES','IMT','CNG','PTI',
  'IDC','MUT','CNF','AFM','RPT','INF','ITU','PSM','PSM2','PPT','PPT2','CJT',
  'DUB','TEN','PUT','IPB'];
$.each(valence_names, function(i,j) {
  if (!$.isArray(input_codes[j])) {input_codes[j] = [];};
  input_codes[j].push(String.fromCharCode(i+0xe03e)); // Primary characters
});
// Primary modifiers
input_codes["NRM"] = inputise(0,[0xe000,0xe18b,0xe18d,0xe18f,0xe191,0xe193,0xe195,0xe197,0xe199]);
input_codes["RPV"] = inputise(0,[0xe18a,0xe18c,0xe18e,0xe190,0xe192,0xe194,0xe196,0xe198,0xe19a]);
input_codes["CSL"] = inputise(0,[0xe004,0xe1af,0xe1b3,0xe1b7,0xe1bb,0xe1bf]);
input_codes["ASO"] = inputise(0,[0xe1ac,0xe1b0,0xe1b4,0xe1b8,0xe1bc,0xe1c0]);
input_codes["VAR"] = inputise(0,[0xe1ad,0xe1b1,0xe1b5,0xe1b9,0xe1bd,0xe1c1]);
input_codes["COA"] = inputise(0,[0xe1ae,0xe1b2,0xe1b6,0xe1ba,0xe1be,0xe1c2]);
input_codes["DEL"] = inputise(0,[0xe004,0xe1ac,0xe1ad,0xe1ae]);
input_codes["PRX"] = inputise(0,[0xe1af,0xe1b0,0xe1b1,0xe1b2]);
input_codes["ICP"] = inputise(0,[0xe1b3,0xe1b4,0xe1b5,0xe1b6]);
input_codes["TRM"] = inputise(0,[0xe1b7,0xe1b8,0xe1b9,0xe1ba]);
input_codes["DPL"] = inputise(0,[0xe1bb,0xe1bc,0xe1bd,0xe1be]);
input_codes["GRA"] = inputise(0,[0xe1bf,0xe1c0,0xe1c1,0xe1c2]);
// Tertiary characters
input_codes["TER"] = inputise(0, [0xe120,0xe121,0xe122,0xe123,0xe124,0xe125,0xe126]);
// Diacritics
// Perspective
input_codes["M"] = inputise(0xe000, [0xe1db]);
input_codes["U"] = inputise(0xe000, [0xe1e4,0xe1e5]);
input_codes["N"] = inputise(0xe000, [0xe1dc,0xe1e2]);
input_codes["A"] = inputise(0xe000, [0xe1dd,0xe1e3]);

input_codes["IFL"] = inputise(0xe000, [0,0xe1e4,0xe1dc,0xe1dd]);
input_codes["FML"] = inputise(0xe000, [0xe1db,0xe1e5,0xe1e2,0xe1e3]);
// Mood
input_codes["MO"] = inputise(0xe000, [0xe1d5,0xe1cc,0xe1cd,0xe1ce,0xe1cf,0xe1d0,0xe1d3,0xe1d4]);
input_codes["SUB"] = inputise(0xe000, [0xe1cc]);
input_codes["ASM"] = inputise(0xe000, [0xe1cd]);
input_codes["SPC"] = inputise(0xe000, [0xe1ce]);
input_codes["COU"] = inputise(0xe000, [0xe1cf]);
input_codes["HYP"] = inputise(0xe000, [0xe1d0]);
input_codes["IPL"] = inputise(0xe000, [0xe1d3]);
input_codes["ASC"] = inputise(0xe000, [0xe1d4]);
input_codes["VER"] = inputise(0xe000, [0,0xe1e6,0xe1e8,0xe1e7,0xe1ed,0xe1ee]);
input_codes["REV"] = inputise(0xe000, [0xe1ef,0xe1f0,0xe1eb,0xe1ec,0xe1e9,0xe1ea]);
input_codes["PRC"] = inputise(0xe000, [0,0xe1ef]);
input_codes["CPT"] = inputise(0xe000, [0xe1e6,0xe1f0]);
input_codes["INE"] = inputise(0xe000, [0xe1e8,0xe1eb]);
input_codes["INC"] = inputise(0xe000, [0xe1e7,0xe1ec]);
input_codes["PST"] = inputise(0xe000, [0xe1ed,0xe1e9]);
input_codes["EFC"] = inputise(0xe000, [0xe1ee,0xe1ea]);
// Phase
input_codes["PHA"] = inputise(0xe060, [0xe1cc,0xe1cd,0xe1cf,0xe1d0,0xe1d1,0xe1d2,0xe1d3,0xe1d4]);
input_codes["PCT"] = inputise(0xe060, [0xe1cc]);
input_codes["ITR"] = inputise(0xe060, [0xe1cd]);
input_codes["REP"] = inputise(0xe060, [0xe1cf]);
input_codes["ITM"] = inputise(0xe060, [0xe1d0]);
input_codes["RCT"] = inputise(0xe060, [0xe1d1]);
input_codes["FRE"] = inputise(0xe060, [0xe1d2]);
input_codes["FRG"] = inputise(0xe060, [0xe1d3]);
input_codes["FLC"] = inputise(0xe060, [0xe1d4]);
// Sanction
input_codes["SA"] = inputise(0xe060, [0xe1cc+26,0xe1cd+26,0xe1cf+26,0xe1d0+26,0xe1d1+26,0xe1d2+26,0xe1d3+26,0xe1d4+26]);
input_codes["EPI"] =inputise(0xe060, [0xe1cc+26]);
input_codes["ALG"] =inputise(0xe060, [0xe1cd+26]);
input_codes["IPU"] =inputise(0xe060, [0xe1cf+26]);
input_codes["RFU"] =inputise(0xe060, [0xe1d0+26]);
input_codes["REB"] =inputise(0xe060, [0xe1d1+26]);
input_codes["THR"] =inputise(0xe060, [0xe1d2+26]);
input_codes["EXV"] =inputise(0xe060, [0xe1d3+26]);
input_codes["ASM"] =inputise(0xe060, [0xe1d4+26]);
// Function
input_codes["STA"] = inputise(0xe186, [0,0xe1d3,0xe1cf,0xe1d1]);
input_codes["DYN"] = inputise(0xe186, [0xe1cc,0xe1d4,0xe1d0,0xe1d2]);
input_codes["MNF"] = inputise(0xe186, [0xe1d5,0xe1cf,0xe1d7,0xe1d9]);
input_codes["DSC"] = inputise(0xe186, [0xe1d6,0xe1d0,0xe1d8,0xe1da]);
// Illocution
input_codes["IL"] = inputise(0xe186, [0,0xe1db,0xe1e4,0xe1cd,0xe1d3,0xe1d4]);
input_codes["NEG"] = inputise(0xe186, [0xe1dd,0xe1e5,0xe1de,0xe1df,0xe1e0,0xe1e1]);
input_codes["ASR"] = inputise(0xe186, [0xe1dd]);
input_codes["IRG"] = inputise(0xe186, [0xe1db,0xe1e5]);
input_codes["DIR"] = inputise(0xe186, [0xe1e4,0xe1de]);
input_codes["ADM"] = inputise(0xe186, [0xe1cd,0xe1df]);
input_codes["HOR"] = inputise(0xe186, [0xe1d3,0xe1e0]);
input_codes["DEC"] = inputise(0xe186, [0xe1d4,0xe1e1]);
// Suffix Degrees
input_codes["DEG"] = inputise(0xe186, [0xe1cc,0xe1d3,0xe1cd,0xe1cf,0,0xe1d0,0xe1ce,0xe1d4,0xe1d5]);
// Consonantal Characters
input_codes["P"] = inputise(0, [0xe127,0xe127+46]);
input_codes["PP"] = inputise(0, [0xe128,0xe128+46]);
input_codes["B"] = inputise(0, [0xe127+23,0xe127+23+46]);
input_codes["PH"] = inputise(0, [0xe128+23,0xe128+23+46]);
input_codes["T"] = inputise(0, [0xe12c,0xe12c+46,0xe12e,0xe12e+46]);
input_codes["TT"] = inputise(0, [0xe12d,0xe12d+46]);
input_codes["D"] = inputise(0, [0xe12c+23,0xe12c+23+46]);
input_codes["TH"] = inputise(0, [0xe12d+23,0xe12d+23+46]);
input_codes["DH"] = inputise(0, [0xe12e+23,0xe12e+23+46]);
input_codes["L"] = inputise(0, [0xe12f,0xe12f+46,0xe12f+23,0xe12f+23+46]);
$.merge(input_codes["M"], inputise(0, [0xe12b,0xe12b+46]));
$.merge(input_codes["N"], inputise(0, [0xe12b+23,0xe12b+23+46,0xe134,0xe134+46]));
input_codes["TL"] = inputise(0, [0xe134+23,0xe134+23+46]);
input_codes["Q"] = inputise(0, [0xe135,0xe135+46]);
input_codes["QQ"] = inputise(0, [0xe136,0xe136+46]);
input_codes["QQ"] = inputise(0, [0xe136+23,0xe136+23+46]);
input_codes["R"] = inputise(0, [0xe13d,0xe13d+46,0xe135+23,0xe135+23+46]);
input_codes["S"] = inputise(0, [0xe13b,0xe13b+46,0xe13c,0xe13c+46]);
input_codes["Z"] = inputise(0, [0xe13b+23,0xe13b+23+46,0xe13c+23,0xe13c+23+46]);
input_codes["C"] = inputise(0, [0xe137,0xe137+46,0xe138,0xe138+46,0xe13d+23,0xe13d+23+46]);
input_codes["ZZ"] = inputise(0, [0xe137+23,0xe137+23+46]);
input_codes["CC"] = inputise(0, [0x139,0x139+46,0x13a,0x13a+46]);
input_codes["CH"] = inputise(0, [0x139+23,0x139+23+46,0x13a+23,0x13a+23+46]);
input_codes["J"] = inputise(0, [0xe138+23,0xe138+23+46]);
input_codes["K"] = inputise(0, [0xe130,0xe130+46]);
input_codes["KK"] = inputise(0, [0xe131,0xe131+46]);
input_codes["G"] = inputise(0, [0xe130+23,0xe130+23+46]);
input_codes["KH"] = inputise(0, [0xe131+23,0xe131+23+46]);
input_codes["X"] = inputise(0, [0xe132,0xe132+46]);
input_codes["XH"] = inputise(0, [0xe132+23,0xe132+23+46]);
input_codes["F"] = inputise(0, [0xe129,0xe129+46]);
input_codes["V"] = inputise(0, [0xe129+23,0xe129+23+46]);
input_codes["W"] = inputise(0, [0xe12a,0xe12a+46]);
input_codes["Y"] = inputise(0, [0xe12a+23,0xe12a+23+46]);
input_codes["H"] = inputise(0, [0xe133,0xe133+46]);
input_codes["GG"] = inputise(0, [0xe133+23,0xe133+23+46]);
// Consonantal Modifiers
// Pattern, Stem and Relation
input_codes["UNF"] = inputise(0, [0xe186,0xe19b,0xe19c,0xe19d,0xe19e,0xe19f,0xe1a0,0xe1a1,0xe1a2]);
input_codes["FRA"] = inputise(0, [0xe1a3,0xe1a4,0xe1a5,0xe1a6,0xe1a7,0xe1a8,0xe1a9,0xe1aa,0xe1ab]);
// Affix Modifiers
input_codes["MM"] = [String.fromCharCode(0xe1c6)];
$.merge(input_codes["L"], [String.fromCharCode(0xe1c3), String.fromCharCode(0xe1b4)]);
$.merge(input_codes["M"], [String.fromCharCode(0xe1af)]);
$.merge(input_codes["R"], [String.fromCharCode(0xe1b3),String.fromCharCode(0xe1b0)]);
$.merge(input_codes["N"], [String.fromCharCode(0xe1b7),String.fromCharCode(0xe1ad)]);
$.merge(input_codes["S"], [String.fromCharCode(0xe1bd),String.fromCharCode(0xe1ac)]);
$.merge(input_codes["Z"], [String.fromCharCode(0xe1bc),String.fromCharCode(0xe1c1)]);
$.merge(input_codes["ZZ"], [String.fromCharCode(0xe1b9)]);
$.merge(input_codes["C"], [String.fromCharCode(0xe1bb),String.fromCharCode(0xe1b5),String.fromCharCode(0xe1c0)]);
$.merge(input_codes["K"], [String.fromCharCode(0xe1ae)]);
$.merge(input_codes["P"], [String.fromCharCode(0xe1b2)]);
$.merge(input_codes["Q"], [String.fromCharCode(0xe1be)]);
$.merge(input_codes["T"], [String.fromCharCode(0xe1c2),String.fromCharCode(0xe1c5)]);
$.merge(input_codes["X"], [String.fromCharCode(0xe1ba)]);
$.merge(input_codes["F"], [String.fromCharCode(0xe1b6)]);
$.merge(input_codes["XH"], [String.fromCharCode(0xe1c4)]);
$.merge(input_codes["B"], [String.fromCharCode(0xe1c7)]);
$.merge(input_codes["D"], [String.fromCharCode(0xe1c9)]);
$.merge(input_codes["DH"], [String.fromCharCode(0xe1cb)]);
$.merge(input_codes["G"], [String.fromCharCode(0xe1b1)]);
$.merge(input_codes["J"], [String.fromCharCode(0xe1ca)]);
// Affix Diacritics
$.merge(input_codes["W"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1e6)]);
$.merge(input_codes["Y"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1e6)]);
$.merge(input_codes["L"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1f0)]);
$.merge(input_codes["R"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1eb),String.fromCharCode(0xe186)+String.fromCharCode(0xe1ec)]);
$.merge(input_codes["M"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1ed)]);
$.merge(input_codes["N"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1ee)]);
$.merge(input_codes["S"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1f2),String.fromCharCode(0xe186)+String.fromCharCode(0xe1f1)]);
$.merge(input_codes["Z"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1ec),String.fromCharCode(0xe186)+String.fromCharCode(0xe1ea)]);
$.merge(input_codes["V"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1e9)]);
$.merge(input_codes["T"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1eb)]);
$.merge(input_codes["DH"], [String.fromCharCode(0xe186)+String.fromCharCode(0xe1eb)]);
// Bias modifiers
input_codes["ASU"] = ['', '', '', ''];
input_codes["HPB"] = ['', '', '', ''];
input_codes["COI"] = ['', '', '', ''];
input_codes["ACP"] = ['', '', '', ''];
input_codes["RAC"] = ['', '', '', ''];
input_codes["STU"] = ['', '', '', ''];
input_codes["CTV"] = ['', '', '', ''];
input_codes["DPV"] = ['', '', '', ''];
input_codes["RVL"] = ['', '', '', ''];
input_codes["GRT"] = ['', '', '', ''];
input_codes["SOL"] = ['', '', '', ''];
input_codes["SEL"] = ['', '', '', ''];
input_codes["IRO"] = ['', '', '', ''];
input_codes["EXA"] = ['', '', '', ''];
input_codes["LTL"] = ['', '', '', ''];
input_codes["CRR"] = ['', '', '', ''];
input_codes["EUP"] = ['', '', '', ''];
input_codes["SKP"] = ['', '', '', ''];
input_codes["CYN"] = ['', '', '', ''];
input_codes["CTP"] = ['', '', '', ''];
input_codes["DSM"] = ['', '', '', ''];
input_codes["IDG"] = ['', '', '', ''];
input_codes["SGS"] = ['', '', '', ''];
input_codes["PPV"] = ['', '', '', ''];
// Misc characters
input_codes["XX"] = inputise(0,[0xe183,0xe184,0xe185,0xe186,0xe187,0xe188,0xe189]);
