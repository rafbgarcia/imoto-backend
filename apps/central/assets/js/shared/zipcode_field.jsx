import React from "react"
import MaskedInput from "react-text-mask"
import Input, { InputLabel } from "material-ui/Input"
import {FormControl} from "material-ui/Form"

export default class ZipcodeField extends React.Component {
  render() {
    const {
      value, onChange, className, fullWidth,
      label, InputClassName, name, disabled,
    } = this.props

    return (
      <FormControl className={className} fullWidth={fullWidth}>
        {label && <InputLabel htmlFor="zipcode">{label}</InputLabel>}
        <Input
          id="zipcode"
          value={value}
          name={name}
          disabled={disabled}
          className={InputClassName}
          onChange={onChange}
          inputComponent={ZipcodeFieldElement}
        />
      </FormControl>
    )
  }
}

class ZipcodeFieldElement extends React.Component {
  render() {
    return (
      <MaskedInput
        {...this.props}
        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
        placeholderChar={"\u2000"}
        guide={false}
      />
    )
  }
}
