require 'rubygems'
require 'sequel'
require 'logger'
require 'strscan'

DB = Sequel.sqlite('oltartkhica.sqlite3', :loggers => [Logger.new(STDERR)])
INFILE = 'Oltartkhica-Regular.sfd'

# The simplest logger
def log(s)
  STDERR.puts(s)
end

def name_for(c, m=nil)
  # ! Don’t forget to modify for 3-character ligatures
  if m
    # Name for ligature
    "uni%X%X.liga" % [c, m]
  else
    # Name for single character
    "uni%X" % c
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