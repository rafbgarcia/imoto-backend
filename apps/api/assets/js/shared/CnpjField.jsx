import React from "react"
import MaskedInput from "react-text-mask"
import Input, { InputLabel } from "material-ui/Input"
import {FormControl, FormHelperText} from "material-ui/Form"

export default class CnpjField extends React.Component {
  render() {
    const {
      value, onChange, className, fullWidth,
      label, InputClassName, name, disabled,
      helperText, margin,
    } = this.props

    return (
      <FormControl margin={margin} className={className} fullWidth={fullWidth}>
        {label && <InputLabel htmlFor="cnpj">{label}</InputLabel>}
        <Input
          id="cnpj"
          value={value}
          name={name}
          className={InputClassName}
          onChange={onChange}
          inputComponent={CnpjFieldElement}
          disabled={disabled}
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
        guide={true}
      />
    )
  }
}
