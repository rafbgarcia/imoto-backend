import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Route } from 'react-router-dom'
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { compose, withProps } from "recompose"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import FiberManualRecordIcon from 'material-ui-icons/FiberManualRecord'
import { red, green, orange } from 'material-ui/colors'

import MotoboyItem from "js/DashboardPage/Motoboys/MotoboyItem"

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

  isSelected(motoboy) {
    return this.state.selectedMotoboy.id == motoboy.id
  }

  render() {
    const {motoboys, loading} = this.props.data
    const {selectedMotoboy} = this.state

    if (loading) {
      return <div>Carregando...</div>
    }

    return (
      <div className="row">
        <div className="col-sm-3">
          <p className="text-muted fz-80">Clique nos motoboys abaixo</p>
          {
            motoboys.map(motoboy =>
              <ListItem
                button
                className={this.isSelected(motoboy) ? "bg-info" : ""}
                disabled={!motoboy.lat}
                key={motoboy.id}
                onClick={() => this.onClickMarker(motoboy)}
              >
                <ListItemIcon>
                  <FiberManualRecordIcon style={{color: getIconColor(motoboy), width: 20}} className="mr-2" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <div>
                      <span>{motoboy.name}</span>
                      {!motoboy.lat && <div><span className="badge badge-secondary">Sem localização</span></div>}
                    </div>
                  }
                  style={{lineHeight: 1.5, padding: 0, margin: 0}}
                />
              </ListItem>
            )
          }
        </div>
        <div className="col-sm-9">
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

  const mapProps = selectedMotoboy.lat && {center: parseLatLng(selectedMotoboy)}

  return (
    <GoogleMap
      defaultZoom={13.6}
      defaultCenter={parseLatLng(validMotoboys[0])}
      {...mapProps}
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
        opacity={1}
      >
        <InfoWindow><div>{motoboy.name}</div></InfoWindow>
      </Marker>
    )
  } else {
    return (
      <Marker
        key={motoboy.id}
        position={{ lat: parseFloat(motoboy.lat), lng: parseFloat(motoboy.lng) }}
        onClick={() => onClickMarker(motoboy)}
        zIndex={1}
        opacity={.7}
      />
    )
  }
}

function parseLatLng({lat, lng}) {
  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  }
}

function getIconColor({available, busy}) {
  if (available) {
    return green[500]
  } else if (busy) {
    return orange[500]
  } else {
    return red[500]
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
