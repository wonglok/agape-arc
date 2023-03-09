@app
agape-arc

@http
get /
post /auth-center
post /app-project
post /app-version
post /graph-center


post /art-project

@aws
profile agape-arc-profile
region us-west-2
architecture arm64

@ws

@create
autocreate true

@static
folder static

@views

@shared
src src/shared

@tables
SocketConnection
  oid *String

GraphDoc
  oid *String

DocNodes
  oid *String

DocEdges
  oid *String

DocAsset
  oid *String

DocJS
  oid *String


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

# YConnectionsTable
#   PartitionKey *string

# YDeltaTable
#   oid *string

# YConn
#   oid *string

# YConnARC
#   oid *string

# YData
#   oid *string

# YUpdates
#   oid *string
