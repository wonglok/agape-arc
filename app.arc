@app
agape-arc

@http
get /
post /auth-center

@aws
profile agape-arc-profile
region us-west-2
architecture arm64

@create
autocreate true

@static
folder static

@views

@shared
src src/shared

@tables
# testdata
#   oid *String

AppRouter
  oid *String

AdminUser
  oid *String

User
  oid *String

AuthToken
  oid *String

App
  oid *String

AppVersion
  oid *String

AppCode
  oid *String
