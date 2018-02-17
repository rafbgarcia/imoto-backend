import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Route } from 'react-router-dom'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { compose, withProps } from "recompose"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"

class LocationPage extends React.Component{
  state = {
    selectedMotoboy: {}
  }

  onClickMarker = (clickedMotoboy) => {
    const {selectedMotoboy} = this.state

    if (selectedMotoboy.id == clickedMotoboy.id) {
      this.setState({ selectedMotoboy: {} })
    } else {
      this.setState({ selectedMotoboy: clickedMotoboy })
    }
  }

  render() {
    const {motoboys, loading} = this.props.data
    const {selectedMotoboy} = this.state

    if (loading) {
      return <div>Carregando...</div>
    }

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
            selectedMotoboy={selectedMotoboy}
            motoboys={motoboys}
            onClickMarker={this.onClickMarker}
            containerElement={<div style={{ height: `80vh` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    )
  }
}

const Map = withGoogleMap((props) => {
  const {motoboys, selectedMotoboy, onClickMarker} = props
  const validMotoboys = (motoboys || []).filter(motoboy => !!motoboy.lat)

  if (validMotoboys.length == 0) {
    return <div>Nenhum motoboy tem localização ainda...</div>
  }

  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: parseFloat(validMotoboys[0].lat), lng: parseFloat(validMotoboys[0].lng) }}
    >
      {validMotoboys.map(motoboy => MotoboyMarker({motoboy, selectedMotoboy, onClickMarker}))}
    </GoogleMap>
  )
})

const MotoboyMarker = ({motoboy, selectedMotoboy, onClickMarker}) => {
  if (motoboy.id == selectedMotoboy.id) {
    return (
      <Marker
        key={motoboy.id}
        position={{ lat: parseFloat(motoboy.lat), lng: parseFloat(motoboy.lng) }}
        onClick={() => onClickMarker(motoboy)}
        zIndex={10}
      >
        InfoBox(motoboy, selectedMotoboy)
      </Marker>
    )
  } else {
    return (
      <Marker
        key={motoboy.id}
        position={{ lat: parseFloat(motoboy.lat), lng: parseFloat(motoboy.lng) }}
        onClick={() => onClickMarker(motoboy)}
        zIndex={1}
      >
        <InfoWindow><div>{motoboy.name}</div></InfoWindow>
      </Marker>
    )
  }
}


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
