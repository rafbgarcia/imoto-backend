import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Route } from 'react-router-dom'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { compose, withProps } from "recompose"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"

class LocationPage extends React.Component{
  render() {
    const {motoboys, loading} = this.props.data
    if (loading) return <div>Carregando...</div>

    return (
      <div className="row">
        <div className="col-sm-2">
          {
            motoboys.map(motoboy =>
              <div className="mb-3 p-2" key={motoboy.id}>
                {motoboy.name} <br />
                {!motoboy.lat && <span className="badge badge-secondary">Sem localização</span> }
              </div>
            )
          }
        </div>
        <div className="col-sm-10">
          <Map
            motoboys={motoboys}
            containerElement={<div style={{ height: `80vh` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    )
  }
}

const Map = withGoogleMap((props) => {
  const {motoboys} = props

  if (!motoboys || motoboys.length == 0 ) {
    return null
  }
  const validMotoboys = motoboys.filter(m => !!m.lat)
  if (validMotoboys.length == 0) {
    return null
  }

  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: parseFloat(validMotoboys[0].lat), lng: parseFloat(validMotoboys[0].lng) }}
    >
      {
        validMotoboys.map(motoboy =>
          <Marker key={motoboy.id} position={{ lat: parseFloat(motoboy.lat), lng: parseFloat(motoboy.lng) }} />
        )
      }
    </GoogleMap>
  )
})

export default graphql(gql`
  query getMotoboys {
    motoboys {
      id
      name
      available
      busy
      lat
      lng
    }
  }
`)(props => <LocationPage {...props} />)
