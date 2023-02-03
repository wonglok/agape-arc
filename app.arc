@app
agape-arc

@http
get /
post /AuthCenter

@aws
# profile default
region us-west-2
architecture arm64

@create
autocreate true

@static
folder public

@shared
src src/shared

@tables
testdata
  oid *String

AppRouter
  oid *String
