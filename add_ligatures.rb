require './routines.rb'

character_range = 0xe0c7..0xe122
ligature_range = 0xe273..0xe28f
free_code = Incrementer.new(DB[:glyphs].max(:code).to_i)

ligature_range.each do |l|
  log "Ligature: %X" % l
  l = DB[:glyphs].where(:unicode=>l).first
  character_range.each do |u|
    log "Character: %X" % u
    u = DB[:glyphs].where(:unicode=>u).first
    splineset = nil
    refer = nil
    if u[:splineset]
      # Normal character
      log "Combining splinesets"
      splineset = u[:splineset] + "\n" + l[:splineset]
    else
      # Reversed or inverted character
      refer = u[:refer].split(' ')
      log "Found reference to character #{name_for(refer[1])}"
      vname = name_for(refer[1], l[:unicode])
      log "Change reference to ligature #{vname}"
      vcode = DB[:glyphs].where(:name=>vname).first[:id].to_i-1
      refer[0] = vcode
      refer[1] = -1
      refer = refer.join(' ')
    end
    n = {
      :width=>1000,
      :flags=>"MW",
      :glyphclass=>3,
      :checked=>false,
      :code=>free_code.next,
      :name=>name_for(u[:unicode], l[:unicode]),
      :splineset=>splineset,
      :refer=>refer,
      :unicode=>-1
    }
    DB[:glyphs].insert(n)
    log "🖖"
  end
end