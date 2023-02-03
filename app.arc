@app
agape-arc

@http
get /

@aws
# profile default
region us-west-2
architecture arm64

@create
autocreate true

@static
folder public

@tables
testdata
  oid *String