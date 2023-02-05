@app
agape-arc

@http
get /
post /auth-center
post /App

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
SystemMeta
  oid *String

AppRouter
  oid *String

AdminUser
  oid *String

User
  oid *String

AuthToken
  oid *String

AppProject
  oid *String

AppVersion
  oid *String

AppCode
  oid *String

ArtProject
  oid *String