number = 92 # Characters per modifier
#startchar, lig, startnum1, startnum2, startchar, lig, startchar, lig
char = 0xe0c7
lig = 0xe267
startnum1 = 66181
startnum2 = 1218
template = %q{StartChar: uni%X%X.liga
Encoding: %d -1 %d
Width: 1000
Flags: HW
HStem: -15 819<494.632 494.632>
VStem: 149.632 655<605 804>
LayerCount: 2
Fore
SplineSet
412.26171875 335.96875 m 5
 581.747070312 425.334960938 l 5
 515.631835938 513 l 5
 411.884765625 454.025390625 l 5
 412.26171875 335.96875 l 5
EndSplineSet
Ligature2: "PatternStemRelation" uni%X uni%X
EndChar

}
number.times do |n|
  puts template % [char, lig, startnum1, startnum2, char, lig, char, lig]
  char+=1
  startnum1+=1
  startnum2+=1
end