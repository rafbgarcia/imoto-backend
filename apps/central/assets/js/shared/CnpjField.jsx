import React from "react"
import MaskedInput from "react-text-mask"
import Input, { InputLabel } from "material-ui/Input"
import {FormControl, FormHelperText} from "material-ui/Form"

export default class CnpjField extends React.Component {
  render() {
    const {
      value, onChange, className, fullWidth,
      label, InputClassName, name, disabled,
      helperText,
    } = this.props

    return (
      <FormControl className={`${className} MuiFormControl-root-83 MuiFormControl-marginNormal-84 MuiFormControl-fullWidth-86`} fullWidth={fullWidth}>
        {label && <InputLabel htmlFor="cnpj">{label}</InputLabel>}
        <Input
          id="cnpj"
          value={value}
          name={name}
          disabled={disabled}
          className={InputClassName}
          onChange={onChange}
          inputComponent={CnpjFieldElement}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    )
  }
}

class CnpjFieldElement extends React.Component {
  render() {
    return (
      <MaskedInput
        {...this.props}
        mask={[/\d/, /\d/, ".", /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/]}
        placeholderChar={"\u2000"}
        guide={false}
      />
    )
  }
}
