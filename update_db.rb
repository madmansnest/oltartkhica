# Updates `oltartkhica.sqlite3` database with data from `Oltartkhica-Regular.sfd`
#
# Run every time after editing `Oltartkhica-Regular.sfd` in FontForge in order to keep 
# the database synced.

require 'rubygems'
require 'sequel'
require 'logger'
require 'strscan'

DB = Sequel.sqlite('oltartkhica.sqlite3', :loggers => [Logger.new(STDERR)])
infile = 'Oltartkhica-Regular.sfd'

# The simplest logger
def log(s)
  STDERR.puts(s)
end

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
    data["sfd_#{m[1].downcase}".to_sym] = m[2] if m
  end
  ss = StringScanner.new(c)
  ss.scan_until(/SplineSet\n/)
  splineset = ss.scan_until(/\nEndSplineSet/)
  data[:sfd_splineset] = splineset.chomp("\nEndSplineSet") if splineset
  codes = data[:sfd_encoding].split(' ')
  data[:sfd_code] = codes[0]
  data[:sfd_unicode] = codes[1]
  data[:sfd_lookupname] = /"(.+?)"/.match(data[:sfd_ligature2])[1] if data[:sfd_ligature2]
  data[:sfd_name] = data[:sfd_startchar]
  update_data = data.select {|k,v| columns.include?(k)}  
  if DB[:glyphs].where(:sfd_name => data[:sfd_name])
    log "\nUpdating Character #{data[:sfd_name]}"
    DB[:glyphs].where(:sfd_name => data[:sfd_name]).update(update_data)
  else
    log "\nAdding Character #{data[:sfd_name]}"
    DB[:glyphs].insert(update_data)
  end
end
log "🖖"