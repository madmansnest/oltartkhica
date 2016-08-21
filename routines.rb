require 'rubygems'
require 'sequel'
require 'logger'
require 'strscan'

DB = Sequel.sqlite('oltartkhica.sqlite3', :loggers => [Logger.new(STDERR)])
# DB = Sequel.sqlite('oltartkhica.sqlite3')
INFILE = 'Oltartkhica-Regular.sfd'

# The simplest logger
def log(s)
  STDERR.puts(s)
end

def name_for(*args)
  if args.size>1
    # Name for ligature
    ("uni"+"%X"*args.size+".liga") % args
  else
    # Name for single character
    "uni%X" % args.first
  end
end

def update_glyph(name, update_data)
  already_exists = DB[:glyphs].where(:name => name)
  if already_exists.count > 0
    original_data = already_exists.first
    if original_data.merge(update_data) == original_data
      log "DB: Skipping identical character #{name}"
    else
      log "DB: Updating character #{name}"
      already_exists.update(update_data)
    end
  else
    log "DB: Inserting character #{name}"
    update_data[:name] = name
    DB[:glyphs].insert(update_data)
  end
end

class Incrementer < Enumerator
  attr_accessor :current
  
  def initialize(start=0)
    @current = start
  end
  
  def next
    @current+=1
  end
end