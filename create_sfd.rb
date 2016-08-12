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
puts "BeginChars: #{DB[:glyphs].max(:sfd_code).to_i+1} #{DB[:glyphs].max(:id).to_i}\n\n"
DB[:glyphs].each do |c|
  puts "StartChar: #{c[:sfd_name]}"
  puts "Encoding: #{c[:sfd_code]} #{c[:sfd_unicode]} #{c[:id]-1}"
  puts "Width: #{c[:sfd_width]}"
  puts "GlyphClass: #{c[:sfd_glyphclass]}"
  puts "Flags: #{c[:sfd_flags]}"
  puts "HStem: #{c[:sfd_hstem]}"
  puts "VStem: #{c[:sfd_vstem]}"
  puts "LayerCount: 2\nFore"
  puts "SplineSet\n#{c[:sfd_splineset]}\nEndSplineSet" if c[:sfd_splineset]
  puts "Refer: #{c[:sfd_refer]}" if c[:sfd_refer]
  if c[:sfd_lookupname]
    components = /uni([0-9|A-F]+)\.liga/.match(c[:sfd_name])[1].scan(/.{4}/).map{|cmp|'uni'+cmp}
    puts %Q{Ligature#{components.size}: "#{c[:sfd_lookupname]}" #{components.join(' ')}}
  end
  puts "EndChar\n\n"
end
puts "EndChars\nEndSplineFont"