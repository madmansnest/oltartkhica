# Creates a new .sfd file from the data in `oltartkhica.sqlite3` database
#
# Run every time before editing in FontForge.

require 'rubygems'
require 'sequel'
require 'logger'

DB = Sequel.sqlite('oltartkhica.sqlite3', :loggers => [Logger.new(STDERR)])

# The simplest logger
def log(s)
  STDERR.puts(s)
end

puts DB[:fontinfo].where(:unit => 'fontinfo').first[:contents]
puts "BeginChars: #{DB[:glyphs].max(:code).to_i+1} #{DB[:glyphs].max(:id).to_i}\n\n"
DB[:glyphs].each do |c|
  puts "StartChar: #{c[:name]}"
  puts "Encoding: #{c[:code]} #{c[:unicode]} #{c[:id]-1}"
  puts "Width: #{c[:width]}"
  puts "GlyphClass: #{c[:glyphclass]}"
  puts "Flags: #{c[:flags]}"
  puts "HStem: #{c[:hstem]}"
  puts "VStem: #{c[:vstem]}"
  puts "LayerCount: 2\nFore"
  puts "SplineSet\n#{c[:splineset]}\nEndSplineSet" if c[:splineset]
  puts "Refer: #{c[:refer]}" if c[:refer]
  if c[:lookupname]
    components = /uni([0-9|A-F]+)\.liga/.match(c[:name])[1].scan(/.{4}/).map{|cmp|'uni'+cmp}
    puts %Q{Ligature#{components.size}: "#{c[:lookupname]}" #{components.join(' ')}}
  end
  puts "EndChar\n\n"
end
puts "EndChars\nEndSplineFont"