import React from 'react'
import PlaceIcon from 'material-ui-icons/Place'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

export default class PlaceSearchField extends React.Component {
  render() {
    const {value, onSelect, onChange, onGeocode} = this.props

    return (
      <PlacesAutocomplete {...placeFieldProps({value, onChange, onSelect, onGeocode})} />
    )
  }
}

function placeFieldProps({value, onChange, onSelect, onGeocode}) {
  return {
    inputProps: {
      value: value,
      onChange: onChange,
      placeholder: "Digite sua busca *",
    },

    styles: {
      root: {
        width: "100%",
      },
      autocompleteContainer: {
        zIndex: 10,
      }
    },

    shouldFetchSuggestions: ({ value }) => value.length > 3,

    renderSuggestion: ({ suggestion }) => (
      <div className="d-flex align-items-center">
        <PlaceIcon fontSize={true} className="m-0 p-0 mr-2" />
        <span className="m-0 p-0">{suggestion}</span>
      </div>
    ),

    onSelect: (address, placeId) => {
      onSelect(address, placeId)

      geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => onGeocode(lat, lng))
    }
  }
}
