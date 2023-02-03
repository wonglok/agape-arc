@app
agape-arc

@http
get /
post /nonce
post /verify-eth-sig
post /verify-jwt

@aws
# profile default
region us-west-2
architecture arm64

@create
autocreate true

@static
folder public

@shared

@tables
testdata
  oid *String

AppRouter
  oid *String

