import React from "react"
import MaskedInput from "react-text-mask"
import Input, { InputLabel } from "material-ui/Input"
import {FormControl} from "material-ui/Form"

export default class PhoneField extends React.Component {
  render() {
    const {
      value, onChange, className, fullWidth,
      label, InputClassName, name, disabled,
    } = this.props

    return (
      <FormControl className={`${className} MuiFormControl-root-83 MuiFormControl-marginNormal-84 MuiFormControl-fullWidth-86`} fullWidth={fullWidth}>
        {label && <InputLabel htmlFor="phoneNumber">{label}</InputLabel>}
        <Input
          id="phoneNumber"
          value={value}
          name={name}
          className={InputClassName}
          onChange={onChange}
          inputComponent={PhoneFieldElement}
          disabled={disabled}
        />
      </FormControl>
    )
  }
}

class PhoneFieldElement extends React.Component {
  phoneMask(phoneNumber) {
    const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "")

    if (rawPhoneNumber.length > 10) {
      return ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    } else {
      return ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }
  }

  render() {
    return (
      <MaskedInput
        {...this.props}
        mask={this.phoneMask}
        placeholderChar={"\u2000"}
        guide={false}
      />
    )
  }
}
