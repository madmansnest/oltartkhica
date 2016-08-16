# Updates `oltartkhica.sqlite3` database with data from `Oltartkhica-Regular.sfd`
#
# Run every time after editing `Oltartkhica-Regular.sfd` in FontForge in order to keep 
# the database synced.

require './routines.rb'

infile = ARGV[0] || INFILE
sfd = File.read(infile)

log "Reading Font Info"

s = StringScanner.new(sfd)
s.scan_until(/BeginChars/)
font_info = s.pre_match

log "Updating Font Info"
DB[:fontinfo].where(:unit => 'fontinfo').update(:contents => font_info)

log "Reading Character Info"
s.scan_until(/\n\n/)

characters = s.rest.split("\n\n")

columns = DB[:glyphs].columns
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
  codes = data[:encoding].split(' ')
  data[:code] = codes[0]
  data[:unicode] = codes[1]
  data[:lookupname] = /"(.+?)"/.match(data[:ligature2])[1] if data[:ligature2]
  data[:name] = data[:startchar]
  update_data = data.select {|k,v| columns.include?(k)}
  already_exists = DB[:glyphs].where(:name => data[:name])
  if already_exists.count > 0
    original_data = already_exists.first
    if original_data.merge(update_data) == original_data
      log "\n Skipping unchanged Character #{data[:name]}"
    else
      log "\nUpdating Character #{data[:name]}"
      already_exists.update(update_data)
    end
  else
    log "\nAdding Character #{data[:name]}"
    DB[:glyphs].insert(update_data)
  end
end
log "🖖"