require 'nokogiri'

font_name = "Oltartkhica-Regular"

ligatures = ((0xe260..0xe270).to_a + (0xe273..0xe28f).to_a).map{|c|"uni" + c.to_s(16).upcase}

font_code = ARGV.pop

names = ARGV

doc = Nokogiri::XML(File.read(font_name+".svg"),&:noblanks)

font = doc.css('font').first
font['id'] = "#{font_name}-#{font_code}"

glyphs = doc.css('glyph')

glyphs.each do |glyph|
  unless (ligatures.include?(glyph['glyph-name'])) || (names.any? {|n| glyph['glyph-name'].index n})
    glyph.remove
  else
    if m = /uni([A-F0-9]+)\.liga/.match(glyph['glyph-name'])
      glyph['unicode'] = m[1].scan(/\w{4}/).map{|c|[c.to_i(16)].pack("U")}.join('')
    end
  end
end

File.open("#{font_name}-#{font_code}.svg",'w') {|f| f.write(doc.to_xml)}

`fontforge -script makeopentype.py #{font_code}`