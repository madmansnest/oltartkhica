source_file = ARGV[0]
threshold = ARGV[1].to_i(16) || 0
shift_by = ARGV[2].to_i(16) || 0

source_string = File.read(source_file)

puts source_string.gsub(/0x[0-9a-f]+/) {|s| s.to_i(16)>=threshold ?  '0x'+(s.to_i(16)+shift_by).to_s(16) : s}