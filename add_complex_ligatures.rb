require './routines.rb'

# Consonantal
character_range = 0xe0c7..0xe122 # Consonantal characters
ligature1_range = 0xe260..0xe270 # Horizontal bar modifiers
ligature2_range = 0xe273..0xe28f # Vertical bar modifiers
free_code = Incrementer.new(DB[:glyphs].max(:code).to_i)

ligature1_range.each do |l1|
  ligature2_range.each do |l2|
    log "Ligature: %X + %X" % [l1, l2]
    character_range.each do |c|
      log "Character: %X (+ %X + %X)" % [c, l1, l2]
      # Add a reference to the character with a vertical bar modifier
      reference_glyph_id = DB[:glyphs].where(:name=>name_for(c, l2)).first[:id].to_i-1
      log "Adding reference to glyph %d" % reference_glyph_id
      refer = reference_glyph_id.to_s + " -1 N 1 0 0 1 0 0 1"
      log "Adding ligature splineset"
      splineset_glyph = DB[:glyphs].where(:name=>name_for(c, l1)).first
      # If splineset is present, we just add it to the character
      if splineset_glyph[:splineset]
        splineset = splineset_glyph[:splineset]
        # If not it means that we should change the reference to the correct glyph
      else
        # The nature (PS transformation) of the reference is the same as that of
        # the splineset glyph
        refer = splineset_glyph[:refer].split(' ')
        base_char_name = DB[:glyphs].where(:id=>refer[0].to_i+1).first[:name]
        new_base_char_name = base_char_name.insert(-6, l2.to_s(16).upcase)
        # p new_base_char_name
        # p refer
        new_base_char_id = DB[:glyphs].where(:name=>new_base_char_name).first[:id].to_i-1
        refer[0] = new_base_char_id
        refer = refer.join(' ')
      end
      n = {
        :width=>1000,
        :flags=>"MW",
        :glyphclass=>3,
        :checked=>false,
        :code=>free_code.next,
        :splineset=>splineset,
        :refer=>refer,
        :unicode=>-1,
        :lookupname=>"Consonantal Horizontal and Vertical Line"
      }    

      update_glyph(name_for(c,l1,l2), n)
      # Without this we can still fit into 65535 characters, although
      # there is no space for Primary Case anyway, but for now only 
      # ligatures <character><horizontal modifier><vertical modifier>
      # will be allowed, and maybe that even will be final

      # updated_id = DB[:glyphs].where(name_for(c,l1,l2)).first[:id].to_i-1
      # n[:refer] = updated_id.to_s + " -1 N 1 0 0 1 0 0 1"
      # update_glyph(name_for(c,l2,l1), n)
    end
  end
end
log "🖖"  
  # l = DB[:glyphs].where(:unicode=>l).first
  # character_range.each do |u|
  #   log "Character: %X" % u
  #   u = DB[:glyphs].where(:unicode=>u).first
  #   splineset = nil
  #   refer = nil
  #   if u[:splineset]
  #     # Normal character
  #     log "Combining splinesets"
  #     splineset = u[:splineset] + "\n" + l[:splineset]
  #   else
  #     # Reversed or inverted character
  #     refer = u[:refer].split(' ')
  #     log "Found reference to character #{name_for(refer[1])}"
  #     vname = name_for(refer[1], l[:unicode])
  #     log "Change reference to ligature #{vname}"
  #     vcode = DB[:glyphs].where(:name=>vname).first[:id].to_i-1
  #     refer[0] = vcode
  #     refer[1] = -1
  #     refer = refer.join(' ')
  #   end
  #   n = {
  #     :width=>1000,
  #     :flags=>"MW",
  #     :glyphclass=>3,
  #     :checked=>false,
  #     :code=>free_code.next,
  #     :name=>name_for(u[:unicode], l[:unicode]),
  #     :splineset=>splineset,
  #     :refer=>refer,
  #     :unicode=>-1
  #   }
  #   DB[:glyphs].insert(n)
  #   log "🖖"
  # end
  # end