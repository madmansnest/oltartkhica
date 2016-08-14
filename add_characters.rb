# Arguments: <starting character unicode> <number of characters to create>
require './routines.rb'

exit(1) unless ARGV.count==2 && ARGV[0]=~ /[0-9a-fA-F]+/i && ARGV[1]=~ /\d+/

start_character = ARGV[0].to_i(16)
number_of_characters = ARGV[1].to_i
start_code = DB[:glyphs].max(:code).to_i+1

number_of_characters.times do |i|
  name = "uni%X" % (start_character+i)
  code = start_code+i
  unicode = start_character+i
  DB[:glyphs].insert({:name=>name, :code=>code, :unicode=>unicode, :width=>1000, :flags=>"MW", :glyphclass=>2, :checked=>false})
end