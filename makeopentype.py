import sys
filename = "Oltartkhica-Regular-%s" % sys.argv[1]
font = fontforge.open("%s.svg" % filename)
font.generate("%s.otf" ""% filename, bitmap_type="", flags=("opentype"))