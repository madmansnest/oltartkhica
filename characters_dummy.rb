number = 92 # Characters per modifier
#startchar, lig, startnum1, startnum2, startchar, lig, startchar, lig
char = 0xe0c7
lig = 0xe270
startnum1 = 67009
startnum2 = 2056
template = %q{StartChar: uni%X%X.liga
Encoding: %d -1 %d
Width: 1000
Flags: W
HStem: 801 165<748 752>
VStem: 587 257<888 965>
LayerCount: 2
Fore
SplineSet
844 888 m 1
 752 966 l 1
 587 965 l 1
 748 801 l 1
 844 888 l 1
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