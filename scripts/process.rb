require 'json'
require 'time'
filename = ARGV[0]

regex = /.*routeCoords = \[([^\]]+)\].*/m

contents = File.read(filename)

data = JSON.parse(contents.gsub(regex, '{"coordinates": [\1]}')
  .gsub('lat:', '"lat":').gsub('lng:', '"lng":')
  .gsub(/,\n\W+\]/m, ']'))

data['name'] = contents.match(/point_popup \+= '([^<]+)/)[1].to_s
data['date'] = Time.parse(contents.scan(/point_popup \+= '(2018[^']+)/).to_s)
data['id'] = filename
File.write("#{filename}.json", JSON.pretty_generate(data))
