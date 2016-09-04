require 'strscan'

class FontUpdater
  attr_accessor :header, :headerB, :glyphs, :glyphsB
  
  # Note: All characters information is contrained in @glyphs
  # All fields are String
  # except for :unicode that is Integer
  
  def initialize(filenameA, filenameB)
    # @primary_start = 0xe000
    # @primary_complex_start = 0xf209c
    x = read_sfd(filenameA)
    @header = x[0]
    @glyphs = x[1]
    x = read_sfd(filenameB)
    @headerB = x[0]
    @glyphsB = x[1]
  end  
    
  def read_sfd(filename)
    ary = []
    s = StringScanner.new(File.read(filename))
    s.scan_until(/BeginChars/)
    header = s.pre_match
    s.scan_until(/\n\n/)
    characters = s.rest.split("\n\n")
    characters.each do |c|
      data = {}
      c.each_line do |l|
            m = /(.+?): (.+?)\n/.match(l)
            data["#{m[1].downcase}".to_sym] = m[2] if m
          end
      ss = StringScanner.new(c)
      ss.scan_until(/SplineSet\n/)
      splineset = ss.scan_until(/\nEndSplineSet/)
      data[:splineset] = splineset.chomp("\nEndSplineSet") if splineset
      data[:unicode] = data[:encoding].split(' ')[1].to_i
      # Get rid of unnecessary fields
      data.delete(:startchar)
      data.delete(:encoding)
      data.delete(:name)
      ary << data
    end
    [header, ary]
  end
  
  def output_optional(ary, index, parameter)
    key = parameter.downcase.to_sym
    ary[index][key] ? "#{parameter}: #{ary[index][key]}\n" : "" 
  end
  
  def sfd(filename, header, glyphs)
    out = header
    out << "BeginChars: 2097152 #{glyphs.length}\n\n"
    glyphs.each_with_index do |j,c|
      out << "StartChar: uni#{j[:unicode].to_s(16).upcase}\n" <<
      "Encoding: #{j[:unicode]} #{j[:unicode]} #{c}\n" <<
      output_optional(glyphs, c,"Width") <<
      # output_optional(glyphs, c,"VWidth") <<
      output_optional(glyphs, c,"Flags") <<
      # output_optional(glyphs, c,"HStem") <<
      # output_optional(glyphs, c,"VStem") <<
      "LayerCount: 2\nFore\n" <<
      output_optional(glyphs, c,"Refer")
      out << "SplineSet\n#{j[:splineset]}\nEndSplineSet\n" if j[:splineset]
      out << "EndChar\n\n"
    end
    out << "EndChars\nEndSplineFont\n"
    File.open(filename, 'w'){|f| f.write(out)}
  end

  def ref_lr(ary, idx)
    "#{idx} #{ary[idx][:unicode]} N -1 0 0 1 0 0 2"
  end
  
  def ref_vi(ary, idx)
    "#{idx} #{ary[idx][:unicode]} N 1 0 0 -1 0 800 2"
  end
  
  def i(unicode)
    if unicode < 0xf0000
      unicode - 0xe000
    else
      unicode - 0xf0000
    end
  end
  
  def fix_all!
    fix_primary_character_references!(@glyphs, 0xe000)
    fix_consonantal_character_references!(@glyphs, 0xe127)
    fix_primary_ce_references!
    fix_consonantal_ce_references!
    fix_primary_cee_references!
  end

  def fix_primary_character_references!(ary, start)
    # Replaces Laterally Reversed and Vertically Inverted Primary Characters with references
    ((0x18..0x02f).to_a + [0x48,0x4a]).each do |c|
      ary[i(start+c)][:refer] = ref_lr(ary, i(start+c-24))
      ary[i(start+c)].delete(:splineset)
    end
    ([0x31] + (0x33..0x47).to_a + [0x49] + (0x4b..0x5f).to_a).each do |c|
      ary[i(start+c)][:refer] = ref_vi(ary, i(start+c-48))
      ary[i(start+c)].delete(:splineset)      
    end
  end
  
  def fix_consonantal_character_references!(ary, start)
    # Replaces Laterally Reversed and Vertically Inverted Consonantal Characters with references
    (0x17..0x2d).each do |c|
      ary[i(start+c)][:refer] = ref_lr(ary, i(start+c-23))
      ary[i(start+c)].delete(:splineset)
    end
    (0x2e..0x5b).each do |c|
      ary[i(start+c)][:refer] = ref_vi(ary, i(start+c-46))
      ary[i(start+c)].delete(:splineset)
    end
  end
  
  def fix_primary_ce_references!
    # ce = Character + [One] Extension
    start = 0xf0000 # Start of Primary Characters with one extension
    while start < 0xf0f00 # Until start of next block — Consonantal
      fix_primary_character_references!(@glyphsB, start)
      start += 96 # Move to the next extension
    end
  end
  
  def fix_consonantal_ce_references!
    # ce = Character + [One] Extension
    start = 0xf0f00 # Start of Consonantal Characters with one extension
    while start < 0xf209c # Until start of next block — Primary with both extensions
      fix_consonantal_character_references!(@glyphsB, start)
      start += 92 # Move to the next extension
    end
  end
  
  def fix_primary_cee_references!
    # cee = Character + Both extensions
    start = 0xf209c
    base_start = 0xe000
    top_start = 0xf0000
    bottom_start = 0xf0660  
    while bottom_start < 0xf0f00 # Next block — Consonantal
      while top_start < 0xf0660 # Original bottom start
        96.times {|n| @glyphsB[i(start+n)] ||= new_character(start+n)}
        ((0..0x17).to_a + [0x30,0x32]).each do |c|        
          @glyphsB[i(start+c)][:splineset] = merge_splinesets(@glyphs[i(base_start+c)][:splineset], @glyphsB[i(top_start+c)][:splineset], @glyphsB[i(bottom_start+c)][:splineset])
        end
        fix_primary_character_references!(@glyphsB, start)
        top_start += 96
        start += 96
        STDERR.print "‧"
        STDERR.flush
      end
      STDERR.puts "‖"
      STDERR.flush
      top_start = 0xf0000 # Reset
      bottom_start+=96
    end
    STDERR.puts "🖖"
    STDERR.flush
  end
  
  def merge_splinesets(base, first, second)
    File.open('base.tmp','w'){|f|f.write(base)}
    File.open('first.tmp','w'){|f|f.write(first)}
    File.open('second.tmp','w'){|f|f.write(second)}
    File.open('patch.tmp','w'){|f|f.write(`diff base.tmp second.tmp`)}
    `patch first.tmp patch.tmp`
    merged = File.read('first.tmp')
    `rm *.tmp`
    merged
  end
  
  # For future reference, Consonantal + Both Modifiers start at 0xfb33c
  
  def new_character(unicode)
    {:width=>"1000", :flags=>"W", :layercount=>"2", :splineset=>"", :unicode=>unicode}
  end
end

f = FontUpdater.new("/Users/infusiastic/Documents/oltartkhica/Oltartkhica-Regular-A.sfd", "/Users/infusiastic/Documents/oltartkhica/Oltartkhica-Regular-B.sfd")
f.fix_all!
f.sfd('testA.sfd', f.header, f.glyphs)
f.sfd('testB.sfd', f.headerB, f.glyphsB)