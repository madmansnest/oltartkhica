# Creates a new .sfd file from the data in `oltartkhica.sqlite3` database
#
# Run every time before editing in FontForge.

require './routines.rb'

checked = ARGV[0]=='checked'

puts DB[:fontinfo].where(:unit => 'fontinfo').first[:contents]
puts "BeginChars: #{DB[:glyphs].max(:code).to_i+1} #{DB[:glyphs].max(:id).to_i}\n\n"
if checked
  glyphs = DB[:glyphs].where(:checked=>1)
else
  glyphs = DB[:glyphs]
end
glyphs.each do |c|
  puts "StartChar: #{c[:name]}"
  puts "Encoding: #{c[:code]} #{c[:unicode]} #{c[:id]-1}"
  puts "Width: #{c[:width]}"
  puts "GlyphClass: #{c[:glyphclass]}"
  puts "Flags: #{c[:flags]}"
  puts "HStem: #{c[:hstem]}" if c[:hstem]
  puts "VStem: #{c[:vstem]}" if c[:vstem]
  puts "LayerCount: 2\nFore"
  puts "SplineSet\n#{c[:splineset]}\nEndSplineSet" if c[:splineset]
  puts "Refer: #{c[:refer]}" if c[:refer]
  if c[:lookupname]
    components = /uni([0-9|A-F]+)\.liga/.match(c[:name])[1].scan(/.{4}/).map{|cmp|'uni'+cmp}
    puts %Q{Ligature2: "#{c[:lookupname]}" #{components.join(' ')}}
  end
  puts "EndChar\n\n"
end
puts "EndChars\nEndSplineFont"